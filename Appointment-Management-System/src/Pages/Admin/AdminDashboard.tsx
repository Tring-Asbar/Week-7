import { useQuery } from "@apollo/client";
import { RadialBarChart, RadialBar, Tooltip, Legend} from "recharts";
import { Card } from "@mui/material";
import { get_Doctor_Users } from "./DoctorListApi";
import { get_Appointments_Count } from "./AppointmentsCountApi";
import { get_Patient_Users } from "./PatientListApi";


const TotalAppointmentsChart = () => {
  const { data:appointments, loading, error } = useQuery(get_Appointments_Count);
  const {data:doctors} = useQuery(get_Doctor_Users)
  const {data:patients} = useQuery(get_Patient_Users)

  if (loading) return (<p>Loading...</p>)
  if (error) return <p>Error fetching data!</p>;

  const totalAppointments = appointments?.getAppointmentsCount?.count || 0;

  const totalDoctors = doctors?.getDoctorUsers?.length || 0

  const totalPatients = patients?.getPatientUsers?.length || 0

  const chartData1 = [
    {
      name: "Total Appointments",
      value: totalAppointments,
      fill: "rgb(149, 172, 231)"
    },
    
  ];
  const chartData2 = [
    {
      name:"Total Doctors",
      value:totalDoctors,
      fill:"rgb(92, 134, 241)"
    }
  ]
  const chartData3 = [
    {
      name:"Total Patients",
      value:totalPatients,
      fill:"rgb(63, 114, 244)"
    }
  ]

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
      data={chartData2}
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
        {totalDoctors}
      </text>
    </RadialBarChart>

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
      data={chartData3}
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
        {totalPatients}
      </text>
    </RadialBarChart>

    

    
    </Card>
    </>
  );
};

export default TotalAppointmentsChart;
