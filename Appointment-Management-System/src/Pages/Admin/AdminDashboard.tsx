import { useQuery, gql } from "@apollo/client";
import { RadialBarChart, RadialBar, Tooltip, Legend} from "recharts";

// GraphQL Query
const GET_APPOINTMENTS = gql`
  query GetAppointments {
    getAppointments {
      patient_appointmentid
    }
  }
`;

const TotalAppointmentsChart = () => {
  const { data, loading, error } = useQuery(GET_APPOINTMENTS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error fetching data!</p>;

  const totalAppointments = data?.getAppointments?.length || 0;

  const chartData = [
    {
      name: "Total Appointments",
      value: totalAppointments,
      fill: "#1976d2",
    },
  ];

  return (
    <>
    <h1>Total Appointments</h1>
    <RadialBarChart
      width={300}
      height={300}
      cx="50%"
      cy="50%"
      innerRadius="60%"
      outerRadius="100%"
      startAngle={90}
      endAngle={-270} // Full circle
      barSize={15}
      data={chartData}
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
    </>
  );
};

export default TotalAppointmentsChart;
