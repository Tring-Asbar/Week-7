import { useQuery } from "@apollo/client";
import { RadialBarChart, RadialBar, Tooltip, Legend} from "recharts";
import { Card } from "@mui/material";
import { get_Appointments_Count } from "../Admin/AppointmentsCountApi";


const TotalAppointmentsChart = () => {
  const { data:appointments, loading, error } = useQuery(get_Appointments_Count);
  

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error fetching data!</p>;

  const totalAppointments = appointments?.getAppointmentsCount?.count || 0;



  const chartData1 = [
    {
      name: "Total Appointments",
      value: totalAppointments,
      fill: "#1976d2"
    },
    
  ];
  

  return (
    <>
    <h1>Total Appointments</h1>
    <Card className="card_element">
    <RadialBarChart
      width={300}
      height={300}
      cx="50%"
      cy="50%"
      innerRadius="60%"
      outerRadius="100%"
      startAngle={90}
      endAngle={-270} // Full circle
      barSize={25}
      data={chartData1}
    >
      <RadialBar  background dataKey="value" />
      <Tooltip />
      <Legend />

      {/* Centered Text Inside Chart */}
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize="24px"
        fontWeight="bold"
        fill="#333"
      >
        {totalAppointments}
      </text>
    </RadialBarChart>

    

    

    
    </Card>
    </>
  );
};

export default TotalAppointmentsChart;
