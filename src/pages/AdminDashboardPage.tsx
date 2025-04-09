import Layout from "@/components/Layout";
import MaintenanceMode from "@/components/MaintenanceMode";

const AdminDashboardPage = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* First column with maintenance mode card */}
          <div className="md:col-span-1">
            <MaintenanceMode />
          </div>
          
          {/* Rest of the dashboard content */}
          <div className="md:col-span-2 space-y-6">
            {/* Existing dashboard content */}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboardPage;
