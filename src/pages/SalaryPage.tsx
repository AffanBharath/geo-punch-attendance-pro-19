
import Layout from "@/components/Layout";
import SalaryCalculator from "@/components/SalaryCalculator";

const SalaryPage = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Salary</h1>
        <SalaryCalculator />
      </div>
    </Layout>
  );
};

export default SalaryPage;
