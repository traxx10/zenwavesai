import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Clipboard,
  Alert,
  ScrollView,
  Dimensions,
} from 'react-native';
import { router, Href } from 'expo-router';
import BackIcon from '../assets/icons/back.svg';
import QRCode from 'react-native-qrcode-svg';
import FacebookIcon from '../assets/icons/facebook.svg';
import EmailIcon from '../assets/icons/emailshare.svg';
import CopyLinkIcon from '../assets/icons/copy-link.svg';
import WhatsAppIcon from '../assets/icons/whatsapp.svg';
import MessageIcon from '../assets/icons/message.svg';
import InstagramIcon from '../assets/icons/instagram.svg';
import XIcon from '../assets/icons/x.svg';
import ScanIcon from '../assets/icons/scan.svg';
import DirectIcon from '../assets/icons/direct.svg';
import TeamIcon from '../assets/icons/team.svg';
import TeamEarningsIcon from '../assets/icons/teamearnings.svg';
import TotalEarningsIcon from '../assets/icons/totalearnings.svg';
import { useNavigation } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Sharing from 'expo-sharing';
import * as Linking from 'expo-linking';

const screenWidth = Dimensions.get('window').width;

// 添加新的接口定义
interface ReferralStats {
  direct_referrals_count: number;
  team_members_count: number;
  total_commission: number;
  monthly_team_revenue: number;
  commission_rate: number;
  invite_code?: string;
}

const InviteFriendsScreen = () => {
  const navigation = useNavigation();
  const [invitationCode, setInvitationCode] = useState('');
  const [showQRCode, setShowQRCode] = useState(false);
  const [stats, setStats] = useState<ReferralStats>({
    direct_referrals_count: 0,
    team_members_count: 0,
    total_commission: 0,
    monthly_team_revenue: 0,
    commission_rate: 0,
    invite_code: ''
  });

  useEffect(() => {
    fetchReferralData();
    fetchInviteCode();
  }, []);

  // 添加数据获取函数
  const fetchReferralData = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) {
        console.error('User ID not found');
        return;
      }

      // 获取推荐统计数据
      const statsResponse = await fetch(`http://127.0.0.1:8000/users/${userId}/referral-stats`);
      const statsData = await statsResponse.json();
      
      // 修改这里：正确处理返回的数据结构
      if (statsData.status === 'success' && statsData.data) {
        setStats({
          direct_referrals_count: statsData.data.direct_referrals_count || 0,
          team_members_count: statsData.data.team_members_count || 0,
          total_commission: statsData.data.total_commission || 0,
          monthly_team_revenue: statsData.data.monthly_team_revenue || 0,
          commission_rate: statsData.data.commission_rate || 0,
          invite_code: statsData.data.invite_code || ''
        });
      } else {
        console.error('Invalid stats data format:', statsData);
      }

    } catch (error) {
      console.error('Error fetching referral data:', error);
      Alert.alert('错误', '加载推荐数据失败');
    }
  };

  const fetchInviteCode = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) {
        console.error('User ID not found');
        return;
      }

      const response = await fetch(`http://127.0.0.1:8000/users/${userId}/invite-code`);
      const data = await response.json();
      
      if (data.status === 'success') {
        setInvitationCode(data.invite_code);
      } else {
        Alert.alert('Error', 'Failed to get invitation code');
      }
    } catch (error) {
      console.error('Error fetching invite code:', error);
      Alert.alert('Error', 'Failed to load invitation code');
    }
  };

  // 复制邀请码
  const copyToClipboard = () => {
    Clipboard.setString(invitationCode);
    Alert.alert('Copied', 'Invitation code copied to clipboard');
  };

  // 切换显示二维码
  const toggleQRCode = () => {
    setShowQRCode(!showQRCode);
  };

  // 添加扫描处理函数
  const handleScan = () => {
    router.push('/qrcodescanner' as Href<string>);
  };

  // 构建分享文本
  const getShareText = () => {
    return `Join me on ZenWaves! Use my invitation code: ${invitationCode}\nDownload the app now: https://zenwaves.app/invite/${invitationCode}`;
  };

  // 处理社交媒体分享
  const handleShare = async (platform: string) => {
    const shareText = getShareText();
    
    try {
      switch (platform) {
        case 'Facebook':
          await Linking.openURL(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`https://zenwaves.app/invite/${invitationCode}`)}`);
          break;
          
        case 'Email':
          await Linking.openURL(`mailto:?subject=Join%20me%20on%20ZenWaves&body=${encodeURIComponent(shareText)}`);
          break;
          
        case 'Copy link':
          await Clipboard.setString(`https://zenwaves.app/invite/${invitationCode}`);
          Alert.alert('Success', 'Link copied to clipboard');
          break;
          
        case 'WhatsApp':
          await Linking.openURL(`whatsapp://send?text=${encodeURIComponent(shareText)}`);
          break;
          
        case 'Message':
          await Linking.openURL(`sms:&body=${encodeURIComponent(shareText)}`);
          break;
          
        case 'Instagram':
          // Instagram 不支持直接分享文本，我们可以复制到剪贴板
          await Clipboard.setString(shareText);
          await Linking.openURL('instagram://');
          Alert.alert('Notice', 'Text copied to clipboard. You can now paste it in Instagram.');
          break;
          
        case 'X':
          await Linking.openURL(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`);
          break;
      }
    } catch (error) {
      console.error(`Error sharing to ${platform}:`, error);
      // 如果应用未安装，提供备选方案
      switch (platform) {
        case 'Facebook':
          await Linking.openURL('https://www.facebook.com/');
          break;
        case 'WhatsApp':
          await Linking.openURL('https://web.whatsapp.com/');
          break;
        case 'Instagram':
          await Linking.openURL('https://www.instagram.com/');
          break;
        case 'X':
          await Linking.openURL('https://twitter.com/');
          break;
        default:
          Alert.alert('Error', `Could not open ${platform}. Please make sure the app is installed.`);
      }
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* 返回按钮 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <BackIcon width={24} height={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Invite Your Friends</Text>
        <TouchableOpacity style={styles.scanButton} onPress={handleScan}>
          <ScanIcon width={24} height={24} />
        </TouchableOpacity>
      </View>

      {/* 邀请码展示 */}
      <Text style={[styles.subTitle, { marginTop: 30 }]}>Copy this code and share it with friends to join ZenWaves.</Text>
      <Text style={[styles.label, { marginTop: 20 }]}>Invitation Code:</Text>
      <View style={[styles.codeContainer, { width: '80%', alignSelf: 'center', marginVertical: 15 }]}>
        <Text style={styles.code}>{invitationCode || 'Loading...'}</Text>
      </View>

      {/* 按钮 */}
      <TouchableOpacity style={[styles.copyButton, { marginTop: 20 }]} onPress={copyToClipboard}>
        <Text style={styles.copyButtonText}>Copy Code</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.qrButton, { marginTop: 15, marginBottom: 20 }]} onPress={toggleQRCode}>
        <Text style={styles.qrButtonText}>Generate QR Code</Text>
      </TouchableOpacity>

      {/* 显示二维码 */}
      {showQRCode && (
        <View style={[styles.qrCodeContainer, { marginVertical: 30 }]}>
          <QRCode value={invitationCode} size={150} />
        </View>
      )}

      {/* 分享邀请链接 */}
      <Text style={[styles.shareTitle, { marginTop: 30, marginBottom: 20 }]}>Share Your Invite Link</Text>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.shareIconsContainer}
      >
        {['Facebook', 'Email', 'Copy link', 'WhatsApp', 'Message', 'Instagram', 'X'].map((platform, index) => (
          <TouchableOpacity 
            key={index} 
            style={styles.shareIcon}
            onPress={() => handleShare(platform)}
          >
            {platform === 'Facebook' && <FacebookIcon width={24} height={24} />}
            {platform === 'Email' && <EmailIcon width={24} height={24} />}
            {platform === 'Copy link' && <CopyLinkIcon width={24} height={24} />}
            {platform === 'WhatsApp' && <WhatsAppIcon width={24} height={24} />}
            {platform === 'Message' && <MessageIcon width={24} height={24} />}
            {platform === 'Instagram' && <InstagramIcon width={24} height={24} />}
            {platform === 'X' && <XIcon width={24} height={24} />}
            <Text style={styles.shareIconText}>{platform}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* 邀请统计 */}
      <View style={[styles.statsContainer, { marginTop: 40 }]}>
        {/* 第一行 */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <DirectIcon width={24} height={24} />
            <Text style={styles.statTitle}>Direct Invites</Text>
            <Text style={styles.statValue}>{stats.direct_referrals_count}</Text>
          </View>
          <View style={styles.statItem}>
            <TeamIcon width={24} height={24} />
            <Text style={styles.statTitle}>Team Members</Text>
            <Text style={styles.statValue}>{stats.team_members_count}</Text>
          </View>
        </View>
        
        {/* 第二行 */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <TeamEarningsIcon width={24} height={24} />
            <Text style={styles.statTitle}>Team Earnings</Text>
            <Text style={styles.statValue}>
              ${(stats.monthly_team_revenue || 0).toFixed(2)}
            </Text>
          </View>
          <View style={styles.statItem}>
            <TotalEarningsIcon width={24} height={24} />
            <Text style={styles.statTitle}>Total Earnings</Text>
            <Text style={styles.statValue}>
              ${(stats.total_commission || 0).toFixed(2)}
            </Text>
          </View>
        </View>
      </View>
      {/* 奖励说明 */}
      <View style={[styles.explanationContainer, { marginTop: 40, marginBottom: 20 }]}>
        <Text style={styles.explanationTitle}>Instructions & Tier Explanation:</Text>
        <Text style={styles.explanationText}>
          Earn More with Direct and Team Referrals.
          Unlock exclusive rewards by inviting more friends to ZenWaves:
        </Text>

        <Text style={styles.sectionHeader}>Direct Referral Rewards:</Text>
        <Text style={[styles.explanationText, { marginVertical: 10 }]}>• Refer 1-4 users and earn 15% of their subscription fees and creator top-up charges.</Text>
        <Text style={styles.explanationText}>• Refer 5-9 users with a minimum personal monthly sales of $220 to earn 18% of their subscription fees and creator top-up charges.</Text>
        <Text style={styles.explanationText}>• Refer 10 or more users with a minimum personal monthly sales of $550 to earn 20% of their subscription fees and creator top-up charges.</Text>

        <Text style={styles.sectionHeader}>Team Performance Rewards:</Text>
        <Text style={[styles.explanationText, { marginVertical: 10 }]}>• Achieve a total monthly team sales of $220 to earn 3% of total team sales, including both subscriptions and top-up charges.</Text>
        <Text style={[styles.explanationText, { marginVertical: 10 }]}>• Achieve a total monthly team sales of $550 to earn 5% of total team sales, including both subscriptions and top-up charges.</Text>
        <Text style={[styles.explanationText, { marginVertical: 10 }]}>• Achieve a total monthly team sales of $1,100 to earn 7% of total team sales, including both subscriptions and top-up charges.</Text>
        <Text style={[styles.explanationText, { marginVertical: 10 }]}>• Achieve a total monthly team sales of $2,200 to earn 10% of total team sales, including both subscriptions and top-up charges.</Text>
      </View>

     
      <View style={{ height: 40 }} />  
    </ScrollView>
  );
};

export default InviteFriendsScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF', padding: 40 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
  },
  scanButton: {
    padding: 8,
  },
  subTitle: { fontSize: 14, color: '#666', marginBottom: 20 },
  label: { fontSize: 16, fontWeight: '500' },
  codeContainer: { backgroundColor: '#F7F7F7', padding: 10, borderRadius: 10, marginVertical: 10 },
  code: { fontSize: 20, fontWeight: 'bold', textAlign: 'center', color: '#FFA500' },
  copyButton: { backgroundColor: '#000', padding: 15, borderRadius: 10, alignItems: 'center', marginVertical: 10 },
  copyButtonText: { color: '#FFF', fontWeight: 'bold' },
  qrButton: { borderWidth: 1, borderColor: '#000', padding: 15, borderRadius: 10, alignItems: 'center', marginVertical: 10 },
  qrButtonText: { color: '#000', fontWeight: 'bold' },
  qrCodeContainer: { alignItems: 'center', marginVertical: 20 },
  shareTitle: { fontSize: 16, fontWeight: '600', marginVertical: 20 },
  shareIconsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
  },
  shareIcon: {
    alignItems: 'center',
    marginRight: 20,
  },
  shareIconText: {
    fontSize: 12,
    marginTop: 5,
  },
  statsContainer: { 
    marginVertical: 20,
    gap: 15, // 行间距
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 15, // 列间距
  },
  statItem: { 
    backgroundColor: '#F7F7F7', 
    padding: 15,
    borderRadius: 10, 
    width: '48%',
    alignItems: 'center', // 居中对齐
  },
  statTitle: { 
    fontSize: 14, 
    color: '#666',
    marginTop: 8,
    marginBottom: 5,
  },
  statValue: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    color: '#000',
  },
  explanationContainer: { backgroundColor: '#F7F7F7', padding: 20, borderRadius: 10, marginTop: 20 },
  explanationTitle: { fontSize: 16, fontWeight: '600', marginBottom: 10 },
  explanationText: { fontSize: 14, color: '#666', marginVertical: 5 },
  sectionHeader: { fontSize: 14, fontWeight: 'bold', marginTop: 15, color: '#000' },
});
