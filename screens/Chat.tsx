import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  FlatList,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {
  faCamera,
  faSmile,
  faPaperPlane,
  faArrowLeft,
} from '@fortawesome/free-solid-svg-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { formatDistanceToNow } from 'date-fns';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ShareMusicIcon from '../assets/icons/sharemusic.svg'; // Replace with the correct path to sharemusic.svg

type Sender = {
  id: string;
  first_name: string;
  last_name: string;
  avatar_url: string;
};

type DraftInfo = {
  title: string;
  cover_url: string;
  duration: number;
};

type Message = {
  id: string;
  isSent?: boolean;
  sender_id: string;
  receiver_id: string;
  content: string;
  message_type: 'text' | 'draft';
  timestamp: string;
  time?: string;
  draft_list_id?: string | null;
  draft_info?: DraftInfo;
  sender: {
    id: string;
    first_name: string;
    last_name: string;
    avatar_url: string;
  };
};

type UserInfo = {
  firstName: string;
  lastName: string;
  avatarUrl: string;
};

export default function ChatScreen() {
  const router = useRouter();
  const { targetUserId } = useLocalSearchParams<{ targetUserId: string }>();
  const [currentUserID, setCurrentUserID] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState('');
  const ws = useRef<WebSocket | null>(null);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    const getCurrentUserId = async () => {
      try {
        const userId = await AsyncStorage.getItem('userId');
        if (userId) {
          setCurrentUserID(userId);
        }
      } catch (error) {
        console.log('Error getting userId from AsyncStorage:', error);
      }
    };

    getCurrentUserId();
  }, []);

  useEffect(() => {
    if (!currentUserID || !targetUserId) return;

    fetchChatHistory();

    ws.current = new WebSocket(
      `ws://127.0.0.1:8000/ws/chat/${currentUserID}`
    );

    ws.current.onopen = () => {
      console.log('Connected to WebSocket');
    };

    ws.current.onmessage = (e) => {
      console.log('Received message:', e.data);
      try {
        const newMessage = JSON.parse(e.data);
        setMessages((prevMessages) => {
          if (
            (newMessage.sender_id === currentUserID && 
             newMessage.receiver_id === targetUserId) ||
            (newMessage.sender_id === targetUserId && 
             newMessage.receiver_id === currentUserID)
          ) {
            if (
              !prevMessages.some(
                (msg) =>
                  msg.timestamp === newMessage.timestamp &&
                  msg.content === newMessage.content &&
                  msg.sender_id === newMessage.sender_id
              )
            ) {
              const updatedMessages = [...prevMessages, newMessage];
              return updatedMessages.sort((a, b) => 
                new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
              );
            }
          }
          return prevMessages;
        });
      } catch (error) {
        console.error('JSON Parse error:', error);
      }
    };

    ws.current.onerror = (error) => {
      console.error('WebSocket error:', error);
      setTimeout(() => {
        if (ws.current?.readyState === WebSocket.CLOSED) {
          console.log('Attempting to reconnect...');
          ws.current = new WebSocket(
            `ws://127.0.0.1:8000/ws/chat/${currentUserID}`
          );
        }
      }, 3000);
    };

    ws.current.onclose = () => {
      console.log('WebSocket disconnected');
      setTimeout(() => {
        if (ws.current?.readyState === WebSocket.CLOSED) {
          console.log('Attempting to reconnect...');
          ws.current = new WebSocket(
            `ws://127.0.0.1:8000/ws/chat/${currentUserID}`
          );
        }
      }, 3000);
    };

    return () => {
      if (ws.current) {
        ws.current.close();
        ws.current = null;
      }
    };
  }, [currentUserID, targetUserId]);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/user/${targetUserId}`);
        const data = await response.json();
        console.log('User info response:', data);

        if (data.user_info) {
          setUserInfo({
            firstName: data.user_info.first_name,
            lastName: data.user_info.last_name,
            avatarUrl: data.user_info.avatar_url,
          });
        } else {
          console.error('Failed to load user info');
        }
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    };

    if (targetUserId) {
      fetchUserInfo();
    }
  }, [targetUserId]);

  const fetchChatHistory = async () => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/chat/${currentUserID}/history/${targetUserId}`
      );
      const data = await response.json();

      if (data.status === 'success' && data.data?.messages) {
        const formattedMessages = data.data.messages
          .map((msg: any) => ({
            ...msg,
            isSent: msg.sender_id === currentUserID,
            timestamp: msg.timestamp || new Date().toISOString()
          }))
          .sort((a: Message, b: Message) => 
            new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
          );
        
        setMessages(formattedMessages);
        
        if (data.data.user_info) {
          setUserInfo({
            firstName: data.data.user_info.first_name,
            lastName: data.data.user_info.last_name,
            avatarUrl: data.data.user_info.avatar_url
          });
        }
      }
    } catch (error) {
      console.error('Error fetching chat history:', error);
      Alert.alert('获取聊天记录时出错');
    }
  };

  const sendMessage = () => {
    if (!ws.current || ws.current.readyState !== WebSocket.OPEN) {
      console.log('WebSocket not connected, attempting to reconnect...');
      ws.current = new WebSocket(
        `ws://127.0.0.1:8000/ws/chat/${currentUserID}`
      );
      ws.current.onopen = () => {
        sendMessageData();
      };
      return;
    }

    sendMessageData();
  };

  const sendMessageData = () => {
    if (messageText && targetUserId && typeof targetUserId === 'string') {
      const messageData: Message = {
        id: Math.random().toString(),
        sender_id: currentUserID,
        receiver_id: targetUserId.toString(),
        content: messageText,
        message_type: 'text',
        timestamp: new Date().toISOString(),
        draft_list_id: null,
        isSent: true,
        sender: {
          id: currentUserID,
          first_name: userInfo?.firstName || '',
          last_name: userInfo?.lastName || '',
          avatar_url: userInfo?.avatarUrl || ''
        }
      };
      
      try {
        ws.current?.send(JSON.stringify(messageData));
        console.log('Message sent successfully');
        
        setMessages((prevMessages) => [...prevMessages, messageData]);
        setMessageText('');
      } catch (error) {
        console.error('Failed to send message:', error);
        Alert.alert('发送消息失败');
      }
    } else {
      console.error('Missing required data:', { messageText, targetUserId });
    }
  };

  // Scroll to bottom whenever messages change
  useEffect(() => {
    if (flatListRef.current && messages.length > 0) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  const handleAcceptInvitation = async (messageId: string, draftListId: string | undefined, senderId: string) => {
    if (!draftListId) {
      console.error('缺少 draft_list_id');
      return;
    }

    try {
      // 先检查是否已经添加过这个草稿
      const checkResponse = await fetch(
        `http://127.0.0.1:8000/check-draft-invitation/${draftListId}/${currentUserID}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      
      const checkData = await checkResponse.json();
      console.log('检查草稿状态:', checkData);

      // 如果是发送者或者已经添加过，直接跳转
      if (senderId === currentUserID || checkData.status === 'exists') {
        router.push({
          pathname: '/friendsmusicedit',
          params: {
            draft_list_id: draftListId,
            friend_id: targetUserId
          }
        });
        return;
      }

      // 只有在草稿不存在时，才执行接受邀请的操作
      const response = await fetch(
        `http://127.0.0.1:8000/accept-draft-invitation/${messageId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const data = await response.json();
      console.log('接受邀请响应:', data);
      
      if (data.status === 'success') {
        router.push({
          pathname: '/friendsmusicedit',
          params: {
            draft_list_id: data.data.draft_list_id,
            friend_id: targetUserId
          }
        });
      } else {
        Alert.alert('错误', '接受邀请失败');
      }
    } catch (error) {
      console.error('处理邀请时出错:', error);
      Alert.alert('错误', '接受邀请失败');
    }
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const getValidDate = (timestamp: string | undefined) => {
      if (!timestamp) return new Date();
      const date = new Date(timestamp);
      return isNaN(date.getTime()) ? new Date() : date;
    };

    const messageDate = getValidDate(item.timestamp);
    let formattedTime = formatDistanceToNow(messageDate, { addSuffix: true });
    formattedTime = formattedTime.replace('about ', '');

    formattedTime = formattedTime
      .replace('minutes', 'min')
      .replace('minute', 'min')
      .replace('hours', 'h')
      .replace('hour', 'h')
      .replace('days', 'd')
      .replace('day', 'd')
      .replace('weeks', 'w')
      .replace('week', 'w')
      .replace('months', 'mo')
      .replace('month', 'mo')
      .replace('years', 'y')
      .replace('year', 'y');

    if (item.message_type === 'draft') {
      const inviteText = item.sender_id === currentUserID 
        ? "You invited to edit this track"
        : "Invite you to edit this track";

      return (
        <TouchableOpacity 
          onPress={() => handleAcceptInvitation(item.id, item.draft_list_id || '', item.sender_id)}
          style={styles.messageWrapper}
        >
          <View style={[
            styles.messageContainer,
            item.sender_id === currentUserID
              ? styles.sentContainer
              : styles.receivedContainer,
          ]}>
            {item.sender_id !== currentUserID && (
              <Image source={{ uri: item.sender.avatar_url }} style={styles.messageAvatar} />
            )}
            <View style={[
              styles.inviteCard,
              item.sender_id === currentUserID ? styles.sentInviteCard : styles.receivedInviteCard,
            ]}>
              <Text style={styles.inviteText}>{inviteText}</Text>
              <View style={styles.inviteImageContainer}>
                {item.draft_info && (
                  <>
                    <Image
                      source={{ uri: item.draft_info.cover_url }}
                      style={styles.inviteImage}
                    />
                    <View style={styles.overlay}>
                      <Text style={styles.trackTitle}>{item.draft_info.title}</Text>
                    </View>
                  </>
                )}
              </View>
            </View>
          </View>
          <Text style={[
            styles.messageTime,
            item.sender_id === currentUserID ? styles.sentTime : styles.receivedTime,
          ]}>
            {formattedTime}
          </Text>
        </TouchableOpacity>
      );
    }

    return (
      <View style={styles.messageWrapper}>
        <View
          style={[
            styles.messageContainer,
            item.sender_id === currentUserID
              ? styles.sentContainer
              : styles.receivedContainer,
          ]}
        >
          {item.sender_id !== currentUserID && userInfo && (
            <Image source={{ uri: userInfo.avatarUrl }} style={styles.messageAvatar} />
          )}
          <View
            style={[
              styles.messageBubble,
              item.sender_id === currentUserID ? styles.sentBubble : styles.receivedBubble,
            ]}
          >
            <Text
              style={[
                styles.messageText,
                item.sender_id === currentUserID ? styles.sentText : styles.receivedText,
              ]}
            >
              {item.content}
            </Text>
          </View>
        </View>
        <Text
          style={[
            styles.messageTime,
            item.sender_id === currentUserID ? styles.sentTime : styles.receivedTime,
          ]}
        >
          {formattedTime}
        </Text>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <FontAwesomeIcon icon={faArrowLeft} size={24} color="#000" />
        </TouchableOpacity>
        <View style={styles.profileOuterCircle}>
          {userInfo && (
            <Image source={{ uri: userInfo.avatarUrl }} style={styles.profileImage} />
          )}
        </View>
        <View style={styles.headerTextContainer}>
          {userInfo && (
            <Text style={styles.profileName}>{`${userInfo.firstName} ${userInfo.lastName}`}</Text>
          )}
          <Text style={styles.statusText}>Online</Text>
        </View>
        <View style={styles.headerIcons}>
          <TouchableOpacity 
            style={styles.iconButton} 
            onPress={() => router.push({
              pathname: '/coedited',
              params: {
                friendId: targetUserId
              }
            })}
          >
            <ShareMusicIcon width={20} height={20} fill="#8E9BB7" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Messages and Input */}
      <View style={styles.chatArea}>
        {/* Messages */}
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={styles.messagesContainer}
          inverted={false}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
          onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
        />

        {/* Message Input */}
        <View style={styles.inputContainer}>
          <TouchableOpacity>
            <FontAwesomeIcon icon={faCamera} size={22} color="#8E9BB7" />
          </TouchableOpacity>
          <TouchableOpacity>
            <FontAwesomeIcon icon={faSmile} size={22} color="#8E9BB7" style={styles.iconSpacing} />
          </TouchableOpacity>
          <TextInput
            style={styles.input}
            placeholder="Type message..."
            value={messageText}
            onChangeText={setMessageText}
          />
          <TouchableOpacity onPress={sendMessage}>
            <FontAwesomeIcon icon={faPaperPlane} size={22} color="#8E9BB7" />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    height: 80,
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 20 : 0,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f1f1',
  },
  backButton: {
    padding: 5,
    marginRight: 10,
  },
  profileOuterCircle: {
    width: 58,
    height: 58,
    borderRadius: 29,
    borderWidth: 2,
    borderColor: '#f1f1f1',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 12,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  headerTextContainer: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  statusText: {
    fontSize: 14,
    color: '#888',
  },
  headerIcons: {
    flexDirection: 'row',
  },
  iconButton: {
    marginLeft: 16,
  },
  chatArea: {
    flex: 1,
    justifyContent: 'space-between',
  },
  messagesContainer: {
    flexGrow: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 10,
  },
  inviteCard: {
    marginVertical: 10,
    paddingVertical: 15,
    borderRadius: 10,
    backgroundColor: '#f1f1f1',
    alignItems: 'flex-start',
  },
  inviteText: {
    fontSize: 16,
    color: '#888',
    marginBottom: 10,
    textAlign: 'left',
    paddingHorizontal: 15,
  },
  inviteImageContainer: {
    width: '100%',
    height: 150,
    borderRadius: 10,
    overflow: 'hidden',
    position: 'relative',
  },
  inviteImage: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 30,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  trackTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
    paddingHorizontal: 10,
    textAlign: 'left',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: '#f1f1f1',
    backgroundColor: '#fff',
  },
  iconSpacing: {
    marginHorizontal: 10,
  },
  input: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    borderRadius: 20,
    padding: 10,
    marginHorizontal: 10,
    fontSize: 16,
  },
  messageWrapper: {
    marginBottom: 15,
  },
  messageContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  sentContainer: {
    alignSelf: 'flex-end',
    flexDirection: 'row-reverse',
  },
  receivedContainer: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
  },
  messageAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 8,
  },
  messageBubble: {
    padding: 12,
    borderRadius: 20,
    maxWidth: '75%',
  },
  sentBubble: {
    backgroundColor: '#555',
  },
  receivedBubble: {
    backgroundColor: '#f1f1f1',
  },
  messageText: {
    fontSize: 16,
  },
  sentText: {
    color: '#fff',
  },
  receivedText: {
    color: '#000',
  },
  messageTime: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
  },
  sentTime: {
    alignSelf: 'flex-end',
    marginTop: 2,
    marginRight: 10,
  },
  receivedTime: {
    alignSelf: 'flex-start',
    marginTop: 2,
    marginLeft: 58,
  },
  draftBubble: {
    padding: 12,
    borderRadius: 20,
    maxWidth: '75%',
  },
  draftTitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  draftPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 8,
  },
  draftCover: {
    width: 50,
    height: 50,
    borderRadius: 8,
  },
  draftInfo: {
    marginLeft: 10,
    flex: 1,
  },
  draftName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  draftDuration: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  sentInviteCard: {
    marginLeft: 92,
    marginRight: 16,
  },
  receivedInviteCard: {
    marginLeft: 16,
    marginRight: 92,
  },
});
