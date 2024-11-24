import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { useNavigation } from '@react-navigation/native';
import { AntDesign } from '@expo/vector-icons';
import BackIcon from '../assets/icons/back.svg';
import MusicIcon from '../assets/icons/mingcute_music-line.svg';
import { Line, Circle, Rect, Text as SvgText } from 'react-native-svg';
import ArrowIcon from '../assets/icons/Arrow.svg';

const screenWidth = Dimensions.get('window').width;
const chartHeight = 220;

type TabType = 'Day' | 'Week' | 'Month' | 'Year';

// 定义数据
const data = {
  Day: [50, 20, 80, 60, 90, 70, 40],
  Week: [200, 400, 300, 500, 450, 600, 350],
  Month: [1.2, 2.3, 1.8, 2.4, 2.8, 2.6, 2.0].map(k => k * 1000), // 1.2K - 2.8K
  Year: [15, 20, 22, 18, 25, 23, 21].map(k => k * 1000),  // 15K - 25K
};

const EarningsOverviewScreen = () => {
  const navigation = useNavigation();
  const [selectedTab, setSelectedTab] = useState<TabType>('Month');
  const [selectedIndex, setSelectedIndex] = useState<number>(6);
  const [selectedEarningId, setSelectedEarningId] = useState('1'); // 默认选中第一项

  // 动态生成标签和数据
  const generateTimeData = (tab: TabType) => {
    const today = new Date();
    const result = {
      labels: [] as string[],
      data: [] as number[],
    };

    switch (tab) {
      case 'Day':
        // 生成最近7天的数据
        for (let i = 6; i >= 0; i--) {
          const date = new Date(today);
          date.setDate(today.getDate() - i);
          result.labels.push(`${date.getMonth() + 1}/${date.getDate()}`);
          result.data.push(data.Day[6 - i]);
        }
        break;

      case 'Week':
        // 生成最近7周的数据
        for (let i = 6; i >= 0; i--) {
          result.labels.push(`Wk${7 - i}`); // 使用简短的标签
          result.data.push(data.Week[6 - i]);
        }
        break;

      case 'Month':
        // 生成最近7个月的数据
        for (let i = 6; i >= 0; i--) {
          const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
          result.labels.push(date.toLocaleString('default', { month: 'short' }));
          result.data.push(data.Month[6 - i]);
        }
        break;

      case 'Year':
        // 生成最近7年的数据
        for (let i = 6; i >= 0; i--) {
          const year = today.getFullYear() - i;
          result.labels.push(year.toString());
          result.data.push(data.Year[6 - i]);
        }
        break;
    }

    return result;
  };

  // 使用 useMemo 缓存计算结果
  const timeData = useMemo(() => generateTimeData(selectedTab), [selectedTab]);

  const upcomingEarnings = [
    { id: '1', name: 'Your Track', date: 'Today, 4:30 PM', amount: '+ $212' },
    { id: '2', name: 'Your Track', date: 'Today, 6:00 PM', amount: '+ $468' },
    { id: '3', name: 'Ad Revenue', date: 'Today, 9:30 PM', amount: '+ $642' },
  ];

  // 修改金额格式化函数，调整阈值和显示格式
  const formatAmount = (amount: number): string => {
    if (amount >= 1000000) {
      return `$${Math.round(amount / 1000000)}M`;
    } else if (amount >= 1000) {
      return `$${Math.round(amount / 1000)}K`;
    }
    return `$${amount}`;
  };

  // 处理触摸事件，允许拖动查看数据点
  const handleTouch = (evt: any) => {
    const { locationX } = evt.nativeEvent;
    const chartWidth = screenWidth - 40;
    const chartPaddingLeft = 30; // 默认的左边距
    const chartPaddingRight = 50; // 增加右边距，防止尾部显示问题
    const usableWidth = chartWidth - chartPaddingLeft - chartPaddingRight;
    const segmentWidth = usableWidth / (timeData.data.length - 1);

    let index = Math.round((locationX - chartPaddingLeft) / segmentWidth);
    index = Math.max(0, Math.min(index, timeData.data.length - 1));
    setSelectedIndex(index);
  };

  return (
    <ScrollView style={styles.container}>
      {/* Back Button */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <BackIcon width={24} height={24} />
        </TouchableOpacity>
        <Text style={styles.overviewTitle}>Earnings Overview</Text>
        <AntDesign name="barschart" size={24} color="#000" />
      </View>

      {/* Total Earnings */}
      <View style={styles.totalContainer}>
        <Text style={styles.totalEarnings}>$12,346</Text>
        <View style={styles.growthContainer}>
          <ArrowIcon width={16} height={16} style={styles.arrowIcon} />
          <Text style={styles.growthText}>
            +51% Growth Compared to Last Month
          </Text>
        </View>
      </View>

      {/* Tab Switching */}
      <View style={styles.tabContainer}>
        {['Day', 'Week', 'Month', 'Year'].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[
              styles.tabButton,
              selectedTab === tab && styles.activeTab,
            ]}
            onPress={() => {
              setSelectedTab(tab as TabType);
              setSelectedIndex(6); // 重置索引到最后一个（当前时间段）
            }}
          >
            <Text
              style={
                selectedTab === tab ? styles.activeTabText : styles.tabText
              }
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Chart */}
      <View style={{ position: 'relative' }}>
        <LineChart
          data={{
            labels: timeData.labels,
            datasets: [{ data: timeData.data }],
          }}
          width={screenWidth - 20} // 增加宽度，防止尾部显示问题
          height={chartHeight}
          yAxisLabel=""
          withHorizontalLines={false}
          withVerticalLines={false}
          chartConfig={{
            backgroundColor: '#FFF',
            backgroundGradientFrom: '#FFF',
            backgroundGradientTo: '#FFF',
            fillShadowGradientFrom: '#9B9B9B',
            fillShadowGradientTo: '#0C0C0C',
            fillShadowGradientOpacity: 0.3,
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            labelColor: () => '#666',
            formatYLabel: (yValue) => {
              const value = parseInt(yValue);
              if (value >= 1000000) {
                return `${Math.round(value / 1000000)}M`;
              } else if (value >= 1000) {
                return `${Math.round(value / 1000)}K`;
              } else {
                return value.toString();
              }
            },
            propsForDots: {
              r: '0',
              strokeWidth: '0',
            },
            propsForBackgroundLines: {
              stroke: '#E4E4E4',
            },
          }}
          segments={5}
          withDots={false}
          getDotColor={() => '#000'}
          bezier
          fromZero
          style={{ paddingRight: 50 }} // 增加右边距
          decorator={() => {
            const chartWidth = screenWidth - 20;
            const chartPaddingLeft = 30;
            const chartPaddingRight = 50;
            const chartPaddingTop = 20;
            const chartPaddingBottom = 20;
            const usableWidth = chartWidth - chartPaddingLeft - chartPaddingRight;
            const segmentWidth = usableWidth / (timeData.data.length - 1);
            const x = segmentWidth * selectedIndex + chartPaddingLeft;
            
            // 获取数据点的值
            const dataPoint = timeData.data[selectedIndex];
            const maxValue = Math.max(...timeData.data);
            const minValue = 0; // 设置为0，因为我们使用了 fromZero
            
            // 计算y坐标（确保与曲线对齐）
            const chartHeightAdjusted = chartHeight - chartPaddingTop - chartPaddingBottom;
            const y = chartHeightAdjusted - 
              ((dataPoint - minValue) / (maxValue - minValue)) * chartHeightAdjusted + 
              chartPaddingTop;

            // 获取当前选中点的详细信息
            const detail = (() => {
              switch (selectedTab) {
                case 'Day':
                  const date = new Date();
                  date.setDate(date.getDate() - (6 - selectedIndex));
                  return `${date.getFullYear()}-${
                    date.getMonth() + 1
                  }-${date.getDate()}`;
                case 'Week':
                  const startOfWeek = new Date();
                  startOfWeek.setDate(
                    startOfWeek.getDate() - (6 - selectedIndex) * 7
                  );
                  const endOfWeek = new Date(startOfWeek);
                  endOfWeek.setDate(startOfWeek.getDate() + 6);
                  return `${
                    startOfWeek.getMonth() + 1
                  }/${startOfWeek.getDate()} - ${
                    endOfWeek.getMonth() + 1
                  }/${endOfWeek.getDate()}`;
                case 'Month':
                  const monthDate = new Date();
                  monthDate.setMonth(
                    monthDate.getMonth() - (6 - selectedIndex)
                  );
                  return `${monthDate.getFullYear()}-${monthDate.toLocaleString(
                    'default',
                    { month: 'short' }
                  )}`;
                case 'Year':
                  return timeData.labels[selectedIndex];
              }
            })();

            return (
              <>
                {/* Vertical Line */}
                <Line
                  x1={x}
                  y1={chartPaddingTop}
                  x2={x}
                  y2={y}
                  stroke="#000"
                  strokeWidth={1}
                />
                {/* Data Point Circle */}
                <Circle
                  cx={x}
                  cy={y}
                  r={6}
                  fill="#FFF"
                  stroke="#000"
                  strokeWidth={2}
                />
                {/* Data Detail Box */}
                <Rect
                  x={
                    x - 50 < 0
                      ? 0
                      : x + 50 > chartWidth
                      ? chartWidth - 100
                      : x - 50
                  }
                  y={y > chartHeight / 2 ? y - 60 : y + 10}
                  width={100}
                  height={45}
                  fill="#FFF"
                  stroke="#000"
                  strokeWidth={1}
                  rx={4}
                />
                {/* Amount */}
                <SvgText
                  x={x}
                  y={y > chartHeight / 2 ? y - 42 : y + 28}
                  fill="#000"
                  fontSize="14"
                  fontWeight="bold"
                  textAnchor="middle"
                >
                  {formatAmount(dataPoint)}
                </SvgText>
                {/* Detail */}
                <SvgText
                  x={x}
                  y={y > chartHeight / 2 ? y - 25 : y + 45}
                  fill="#666"
                  fontSize="11"
                  textAnchor="middle"
                >
                  {detail}
                </SvgText>
              </>
            );
          }}
          yAxisSuffix=""
        />
        {/* Touch Overlay */}
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: screenWidth - 20,
            height: chartHeight,
          }}
          onStartShouldSetResponder={() => true}
          onMoveShouldSetResponder={() => true}
          onResponderGrant={handleTouch}
          onResponderMove={handleTouch}
        />
      </View>

      {/* Upcoming Earnings */}
      <View style={styles.upcomingContainer}>
        <Text style={styles.upcomingTitle}>Upcoming Earnings</Text>
        {upcomingEarnings.map((item) => (
          <TouchableOpacity 
            key={item.id} 
            style={[
              styles.earningItem,
              item.id === selectedEarningId && styles.selectedEarningItem
            ]}
            onPress={() => setSelectedEarningId(item.id)}
          >
            <View style={styles.iconContainer}>
              <View style={styles.iconBackground} />
              <MusicIcon width={24} height={24} style={styles.icon} />
            </View>
            <View style={styles.earningDetails}>
              <Text style={styles.earningName}>{item.name}</Text>
              <Text style={styles.earningDate}>{item.date}</Text>
            </View>
            <Text style={styles.earningAmount}>{item.amount}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

export default EarningsOverviewScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF', padding: 20 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  overviewTitle: { fontSize: 18, fontWeight: '600' },
  totalContainer: { alignItems: 'center', marginBottom: 20 },
  totalEarnings: { fontSize: 32, fontWeight: 'bold', color: '#000' },
  growthContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  arrowIcon: {
    marginRight: 4,
  },
  growthText: { 
    fontSize: 14,
    color: '#000000', // 改为黑色
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  tabButton: { 
    paddingVertical: 10, 
    paddingHorizontal: 20,
    borderRadius: 5, // 添加圆角
  },
  activeTab: { 
    backgroundColor: '#E4E4E4', // 改为灰色背景
    borderBottomWidth: 0, // 移除之前的蓝色下划线
  },
  tabText: { 
    color: '#888' 
  },
  activeTabText: { 
    color: '#000000', // 改为黑色
    fontWeight: 'bold',
  },
  chart: { marginVertical: 20, borderRadius: 16 },
  upcomingContainer: {
    backgroundColor: '#F7F7F7',
    padding: 15,
    borderRadius: 16,
    marginTop: 20,
  },
  upcomingTitle: { fontSize: 18, fontWeight: '600', marginBottom: 15 },
  earningItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
    padding: 10,
    borderRadius: 15,
  },
  selectedEarningItem: {
    backgroundColor: '#D2D2D2',
  },
  iconContainer: {
    position: 'relative',
    width: 24,
    height: 24,
    marginRight: 10,
  },
  iconBackground: {
    position: 'absolute',
    width: 32,
    height: 32,
    backgroundColor: '#B3B3B3',
    borderRadius: 16,
    top: -4,
    left: -4,
  },
  icon: {
    position: 'relative',
    zIndex: 1,
  },
  earningDetails: { flex: 1 },
  earningName: { fontSize: 16, color: '#000' },
  earningDate: { fontSize: 12, color: '#666' },
  earningAmount: { 
    fontSize: 16, 
    fontWeight: 'normal', 
    color: '#000000', // 改为黑色
  },
});
