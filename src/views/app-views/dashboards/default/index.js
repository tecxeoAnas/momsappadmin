// import React, { useEffect, useState } from "react";
// import { Row, Col, Button, Avatar, Dropdown, Table, Menu, Tag } from 'antd';
// import StatisticWidget from 'components/shared-components/StatisticWidget';
// import ChartWidget from 'components/shared-components/ChartWidget';
// import AvatarStatus from 'components/shared-components/AvatarStatus';
// import GoalWidget from 'components/shared-components/GoalWidget';
// import Card from 'components/shared-components/Card';
// import Flex from 'components/shared-components/Flex';
// import { 
//   VisitorChartData, 
//   AnnualStatisticData, 
//   ActiveMembersData, 
//   NewMembersData, 
//   RecentTransactionData 
// } from './DefaultDashboardData';
// import ApexChart from 'react-apexcharts';
// import { apexLineChartDefaultOption, COLOR_2 } from 'constants/ChartConstant';
// import { SPACER } from 'constants/ThemeConstant'
// import { 
//   UserAddOutlined, 
//   FileExcelOutlined, 
//   PrinterOutlined, 
//   PlusOutlined, 
//   EllipsisOutlined, 
//   StopOutlined, 
//   ReloadOutlined 
// } from '@ant-design/icons';
// import utils from 'utils';
// import { useDispatch, useSelector } from 'react-redux';
// import { fetchUniversities, fetchUsers } from "services/UniversityService";
// import dayjs from "dayjs";

// export const DefaultDashboard = () => {
//   const { direction } = useSelector(state => state.theme)
//    const {allusers, items} = useSelector(state => state.momsReducer)

//    const dispatch =  useDispatch()

//    useEffect(() => {
//     dispatch(fetchUniversities())
//     dispatch(fetchUsers())
//    },[dispatch])

// const annualStatisticData = [
// 	{
// 		title: 'Total Universities',
// 		value: items?.length || 0, 
// 		// status: -11.4,
// 		// subtitle: `Compare to last year (2024)`
// 	},
// 	{
// 		title: 'Total Users',
// 		value: allusers?.filter(u => u.role === "user").length || 0, 
// 		// status: 8.2,
// 		// subtitle: `Compare to last year (2024)`
// 	},
// 	{
// 		title: 'Total Admin',
// 		value: allusers?.filter(u => u.role === "admin").length || 0, 
// 		// status: 0.7,
// 		// subtitle: `Compare to last year (2024)`
// 	}
// ]


// // const activeMembersData = [{
// //   name: 'Members',
// //   data: [25, 15, 41, 25, 44, 12, 36, 19, 54]
// // }]

// // const visitorChartData = {
// //   	series: [
// // 		{
// // 			name: "Session Duration",
// // 			data: [45, 52, 38, 24, 33, 26, 21, 20, 6, 8, 15, 10]
// // 		},
// // 		{
// // 			name: "Page Views",
// // 			data: [35, 41, 62, 42, 13, 18, 29, 37, 36, 51, 32, 35]
// // 		}
// // 	],
// // 	categories:[
// // 		'01 Jan', 
// // 		'02 Jan', 
// // 		'03 Jan', 
// // 		'04 Jan', 
// // 		'05 Jan', 
// // 		'06 Jan', 
// // 		'07 Jan', 
// // 		'08 Jan', 
// // 		'09 Jan',
// // 		'10 Jan', 
// // 		'11 Jan', 
// // 		'12 Jan'
// // 	]
// // }
// // const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]

// // // Count users by month
// // const usersByMonth = months.map((m, i) =>
// //   allusers.filter(u => dayjs(u.createdAt).month() === i).length
// // )

// // // Chart data
// // const visitorChartData = {
// //   series: [
// //     {
// //       name: "New Users",
// //       data: usersByMonth
// //     }
// //   ],
// //   categories: months
// // }

// const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

// // --- MONTH-WISE COUNT ---
// const usersByMonth = months.map((m, i) =>
//   allusers.filter(u => dayjs(u.createdAt).month() === i).length
// );

// // --- DAY-WISE COUNT (current month ke liye) ---
// const currentMonth = dayjs().month(); // abhi ka month
// const daysInMonth = dayjs().daysInMonth(); // us month ke total din

// const usersByDay = Array.from({ length: daysInMonth }, (_, i) =>
//   allusers.filter(u => 
//     dayjs(u.createdAt).month() === currentMonth &&
//     dayjs(u.createdAt).date() === i + 1
//   ).length
// );

// // Labels for days
// const dayLabels = Array.from({ length: daysInMonth }, (_, i) =>
//   `${String(i + 1).padStart(2, "0")} ${months[currentMonth]}`
// );

// // --- Chart Data ---
// const visitorChartData = {
//   series: [
//     {
//       name: "Users by Month",
//       data: usersByMonth
//     },
//     {
//       name: "Users by Day",
//       data: usersByDay
//     }
//   ],
//   categories: [...months, ...dayLabels] // tum chaho to alag bhi kar sakte ho
// };

//   return (
//     <>  
//       <Row gutter={16}>
//         <Col xs={24} sm={24} md={24} lg={24}>
//           <Row gutter={16}>
//             {
//               annualStatisticData.map((elm, i) => (
//                 <Col xs={24} sm={24} md={24} lg={24} xl={8} key={i}>
//                   <StatisticWidget 
//                     title={elm.title} 
//                     value={elm.value}
//                     status={elm.status}
//                     subtitle={elm.subtitle}
//                   />
//                 </Col>
//               ))
//             }
//           </Row>
//           <Row gutter={16}>
//             <Col span={24}>
//                 <ChartWidget 
//                   title="Unique Users" 
//                   series={visitorChartData.series} 
//                   xAxis={visitorChartData.categories} 
//                   height={'400px'}
//                   direction={direction}
//                 />
//             </Col>
//           </Row>
//         </Col>
//         {/* <Col xs={24} sm={24} md={24} lg={6}>
//           <GoalWidget 
//             title="Monthly Users" 
//             value={87}
//             subtitle="You need abit more effort to hit monthly target"
//             extra={<Button type="primary">Learn More</Button>}
//           />
//           <StatisticWidget 
//             title={
//               <MembersChart 
//                 options={memberChartOption}
//                 series={activeMembersData}
//                 height={145}
//               />
//             }
//             value='17,329'
//             status={3.7}
//             subtitle="Active members"
//           />
//         </Col> */}
//       </Row>
      
//     </>
//   )
// }


// export default DefaultDashboard;



// import React, { useEffect, useState } from "react";
// import { Row, Col, Select } from "antd";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchUniversities, fetchUsers } from "services/UniversityService";
// import dayjs from "dayjs";
// import ApexChart from "react-apexcharts";

// export const DefaultDashboard = () => {
//   const { direction } = useSelector((state) => state.theme);
//   const { allusers, items } = useSelector((state) => state.momsReducer);

//   const dispatch = useDispatch();

//   useEffect(() => {
//     dispatch(fetchUniversities());
//     dispatch(fetchUsers());
//   }, [dispatch]);

//   // --- Stats
//   const annualStatisticData = [
//     { title: "Total Universities", value: items?.length || 0 },
//     { title: "Total Users", value: allusers?.filter((u) => u.role === "user").length || 0 },
//     { title: "Total Admin", value: allusers?.filter((u) => u.role === "admin").length || 0 },
//   ];

//   // --- Users by Month ---
//   const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
//   const usersByMonth = months.map((_, i) =>
//     allusers.filter((u) => dayjs(u.createdAt).month() === i).length
//   );

//   // --- Users by Day (current month) ---
//   const currentMonth = dayjs().month();
//   const daysInMonth = dayjs().daysInMonth();
//   const usersByDay = Array.from({ length: daysInMonth }, (_, i) =>
//     allusers.filter(
//       (u) =>
//         dayjs(u.createdAt).month() === currentMonth &&
//         dayjs(u.createdAt).date() === i + 1
//     ).length
//   );
//   const dayLabels = Array.from({ length: daysInMonth }, (_, i) =>
//     `${String(i + 1).padStart(2, "0")} ${months[currentMonth]}`
//   );

//   // --- View Mode toggle ---
//   const [viewMode, setViewMode] = useState("month");

//   const chartOptions = {
//     month: {
//       title: "📆 Monthly New Users",
//       categories: months,
//       series: [{ name: "New Users", data: usersByMonth }],
//     },
//     day: {
//       title: `📅 Daily New Users (${months[currentMonth]})`,
//       categories: dayLabels,
//       series: [{ name: "New Users", data: usersByDay }],
//     },
//   };

//   // --- ApexChart Config ---
//   const getChartConfig = (categories, series, title) => ({
//     series,
//     options: {
//       chart: {
//         type: "area",
//         toolbar: { show: false },
//         zoom: { enabled: false },
//       },
//       stroke: {
//         curve: "smooth",
//         width: 3,
//       },
//       xaxis: {
//         categories,
//         labels: { style: { fontSize: "12px" } },
//       },
//       yaxis: {
//         labels: { style: { fontSize: "12px" } },
//       },
//       fill: {
//         type: "gradient",
//         gradient: {
//           shadeIntensity: 1,
//           opacityFrom: 0.4,
//           opacityTo: 0.1,
//           stops: [0, 90, 100],
//         },
//       },
//       colors: ["#4f46e5"],
//       markers: {
//         size: 5,
//         colors: ["#fff"],
//         strokeColors: "#4f46e5",
//         strokeWidth: 2,
//       },
//       tooltip: {
//         theme: "dark",
//         y: {
//           formatter: (val) => `${val} users`,
//         },
//       },
//       title: {
//         text: title,
//         align: "left",
//         style: { fontSize: "16px", fontWeight: "600" },
//       },
//     },
//   });

//   const currentChart = chartOptions[viewMode];

//   return (
//     <>
//       <Row gutter={16}>
//         {/* Stats */}
//         {annualStatisticData.map((elm, i) => (
//           <Col xs={24} sm={24} md={24} lg={24} xl={8} key={i}>
//             <div className="p-4 bg-white rounded-lg shadow">
//               <h4 className="text-sm text-gray-500">{elm.title}</h4>
//               <p className="text-2xl font-bold">{elm.value}</p>
//             </div>
//           </Col>
//         ))}
//       </Row>

//       <Row gutter={16} className="mt-6">
//         <Col span={24}>
//           <div className="flex justify-between items-center mb-4">
//             <h2 className="text-lg font-semibold text-gray-800">Unique Users</h2>
//             <Select
//               defaultValue="month"
//               style={{ width: 150 }}
//               onChange={(val) => setViewMode(val)}
//               options={[
//                 { value: "month", label: "Month View" },
//                 { value: "day", label: "Day View" },
//               ]}
//             />
//           </div>
//           <ApexChart
//             options={getChartConfig(currentChart.categories, currentChart.series, currentChart.title).options}
//             series={getChartConfig(currentChart.categories, currentChart.series, currentChart.title).series}
//             type="area"
//             height={400}
//           />
//         </Col>
//       </Row>
//     </>
//   );
// };

// export default DefaultDashboard;


import React, { useEffect, useState } from "react";
import { Row, Col, Select, Card, Avatar, Statistic, Progress } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { fetchUniversities, fetchUsers } from "services/momsService";
import dayjs from "dayjs";
import ApexChart from "react-apexcharts";
import {
  UserOutlined,
  TeamOutlined,
  BankOutlined,
  TrophyOutlined,
  CalendarOutlined,
  EyeOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
} from "@ant-design/icons";

export const DefaultDashboard = () => {
  const { direction } = useSelector((state) => state.theme);
  const { allusers, items } = useSelector((state) => state.momsReducer);

  const dispatch = useDispatch();

  useEffect(() => {
    // dispatch(fetchUniversities());
    dispatch(fetchUsers());
  }, [dispatch]);

  // --- Enhanced Stats with growth calculation ---
  const totalUsers = allusers?.filter((u) => u.role === "user").length || 0;
  const totalAdmins = allusers?.filter((u) => u.role === "admin").length || 0;
  const totalUniversities = items?.length || 0;


  const annualStatisticData = [
    { 
      title: "Total Universities", 
      value: totalUniversities,
      // growth: universityGrowth,
      icon: <BankOutlined style={{ fontSize: '24px' }} />,
      color: "#000000",
      // bgGradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
    },
    { 
      title: "Active Users", 
      value: totalUsers,
      // growth: userGrowth,
      icon: <TeamOutlined style={{ fontSize: '24px' }} />,
      color: "#000000",
      // bgGradient: "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)"
    },
    { 
      title: "Admin Users", 
      value: totalAdmins,
      // growth: adminGrowth,
      icon: <UserOutlined style={{ fontSize: '24px' }} />,
      color: "#000000",
      // bgGradient: "linear-gradient(135deg, #ffb347 0%, #ffcc33 100%)"
    },
  ];

  // --- University Performance Data ---
  const universityPerformance = items?.slice(0, 3).map((uni, index) => {
    const userCount = allusers?.filter(user => user.universityId === uni.id).length || Math.floor(Math.random() * 100);
    return {
      name: uni.name,
      users: userCount,
      logo: uni.logo,
      percentage: (userCount / totalUsers) * 100 || Math.floor(Math.random() * 80) + 20
    };
  }) || [];

  // --- Users by Month ---
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const usersByMonth = months.map((_, i) =>
    allusers?.filter((u) => dayjs(u.createdAt).month() === i).length || 0
  );

  // --- Users by Day (current month) ---
  const currentMonth = dayjs().month();
  const daysInMonth = dayjs().daysInMonth();
  const usersByDay = Array.from({ length: daysInMonth }, (_, i) =>
    allusers?.filter(
      (u) =>
        dayjs(u.createdAt).month() === currentMonth &&
        dayjs(u.createdAt).date() === i + 1
    ).length || 0
  );
  const dayLabels = Array.from({ length: daysInMonth }, (_, i) =>
    `${String(i + 1).padStart(2, "0")}`
  );

  // --- Role Distribution ---
  const roleData = [
    { name: "Users", value: totalUsers, color: "#FF79A4" },
    { name: "Admins", value: totalAdmins, color: "#FF96A4" },
  ];

  // --- View Mode toggle ---
  const [viewMode, setViewMode] = useState("month");

  const chartOptions = {
    month: {
      title: "Monthly User Growth",
      categories: months,
      series: [{ name: "New Users", data: usersByMonth }],
    },
    day: {
      title: `Daily Activity - ${months[currentMonth]}`,
      categories: dayLabels,
      series: [{ name: "New Users", data: usersByDay }],
    },
  };

  // --- Enhanced ApexChart Config ---
  const getChartConfig = (categories, series, title) => ({
    series,
    options: {
      chart: {
        type: "area",
        toolbar: { show: false },
        zoom: { enabled: false },
        fontFamily: 'Inter, sans-serif',
        animations: {
          enabled: true,
          easing: 'easeinout',
          speed: 800,
        }
      },
      stroke: {
        curve: "smooth",
        width: 3,
      },
      xaxis: {
        categories,
        labels: { 
          style: { 
            fontSize: "12px",
            fontWeight: 500,
            colors: '#6b7280'
          } 
        },
        axisBorder: { show: false },
        axisTicks: { show: false },
      },
      yaxis: {
        labels: { 
          style: { 
            fontSize: "12px",
            fontWeight: 500,
            colors: '#6b7280'
          } 
        },
      },
      fill: {
        type: "gradient",
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.6,
          opacityTo: 0.1,
          stops: [0, 90, 100],
          colorStops: [
            {
              offset: 0,
              color: "#4f46e5",
              opacity: 0.6
            },
            {
              offset: 100,
              color: "#818cf8",
              opacity: 0.1
            }
          ]
        },
      },
      colors: ["#4f46e5"],
      markers: {
        size: 0,
        hover: {
          size: 8,
          sizeOffset: 3
        }
      },
      tooltip: {
        theme: "dark",
        style: {
          fontSize: '12px',
          fontFamily: 'Inter, sans-serif'
        },
        y: {
          formatter: (val) => `${val} users`,
        },
        marker: {
          show: true,
        }
      },
      grid: {
        borderColor: '#f3f4f6',
        strokeDashArray: 3,
      },
      dataLabels: {
        enabled: false
      }
    },
  });

  // --- Donut Chart Config ---
  const donutConfig = {
    series: roleData.map(item => item.value),
    options: {
      chart: {
        type: 'donut',
        fontFamily: 'Inter, sans-serif',
      },
      colors: roleData.map(item => item.color),
      labels: roleData.map(item => item.name),
      legend: {
        position: 'bottom',
        fontSize: '14px',
        fontWeight: 500,
      },
      plotOptions: {
        pie: {
          donut: {
            size: '65%',
          }
        }
      },
      tooltip: {
        y: {
          formatter: (val) => `${val} users`
        }
      }
    }
  };

  const currentChart = chartOptions[viewMode];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Dashboard Overview</h1>
        <p className="text-gray-600">Welcome back! Here's what's happening with your platform.</p>
      </div>

      {/* Enhanced Stats Cards */}
      <Row gutter={[24, 24]} className="mb-8">
        {annualStatisticData.map((elm, i) => (
          <Col xs={24} sm={24} md={8} lg={8} xl={8} key={i}>
            <Card 
              className="relative overflow-hidden border-0 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              style={{
                background: elm.bgGradient,
                minHeight: '140px'
              }}
            >
              <div className="relative z-10">
                <div className="flex items-center justify-between">
                  <div className="text-white/70" style={{color:"#FF79A4"}}>
                    {elm.icon}
                  </div>
                  <div className="text-white">
                    <p className="text-white/80 text-md mb-1 text-dark" style={{fontSize: "18px"}}>{elm.title}</p>
                    <p className="text-3xl font-bold mb-2 text-dark" style={{fontSize: "20px"}}>{elm.value}</p>
                  </div>
                </div>
              </div>
              <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10"></div>
              <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/5 rounded-full -ml-8 -mb-8"></div>
            </Card>
          </Col>
        ))}
      </Row>

      <Row gutter={[24, 24]}>
        {/* Main Chart */}
        <Col xs={24} lg={16}>
          <Card 
            className="shadow-sm border-0 h-full"
            title={
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <EyeOutlined className="mr-2 text-blue-600" />
                  <span className="text-lg font-semibold">User Analytics</span>
                </div>
                <Select
                  defaultValue="month"
                  style={{ width: 150, marginTop:"20px" }}
                  onChange={(val) => setViewMode(val)}
                  options={[
                    { value: "month", label: "📊 Monthly" },
                    { value: "day", label: "📅 Daily" },
                  ]}
                />
              </div>
            }
          >
           <ApexChart
  options={{
    ...getChartConfig(currentChart.categories, currentChart.series, currentChart.title).options,
    colors: ["#FF79A4"], // Brown color hex
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.2,
        stops: [0, 100],
        colorStops: [
          {
            offset: 0,
            color: "#FF79A4", // Dark brown
            opacity: 0.8
          },
          {
            offset: 100,
            color: "#FF79A4", // Light brown (tan shade)
            opacity: 0.2
          }
        ]
      }
    },
    stroke: {
      curve: "smooth",
      width: 3,
      colors: ["#FF79A4"] // Line color
    }
  }}
  series={getChartConfig(currentChart.categories, currentChart.series, currentChart.title).series}
  type="area"
  height={350}
/>

          </Card>
        </Col>

        {/* Side Panel */}
        <Col xs={24} lg={8}>
          <Row gutter={[0, 28]}>
            {/* Role Distribution */}
            <Col span={24}>
              <Card 
                className="shadow-sm border-0"
                title={
                  <div className="flex items-center">
                    <TrophyOutlined className="mr-2 text-orange-500" />
                    <span className="text-lg font-semibold">User Distribution</span>
                  </div>
                }
              >
                <ApexChart
                  options={donutConfig.options}
                  series={donutConfig.series}
                  type="donut"
                  height={400}
                />
              </Card>
            </Col>


          </Row>
        </Col>
      </Row>
    </div>
  );
};

export default DefaultDashboard;