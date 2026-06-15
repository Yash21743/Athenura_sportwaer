import AdminSidebar from '../common/adminlayout/AdminSidebar';

const AdminProducts = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />
      <main className="flex-1 p-8">
        <h1 className="text-3xl font-bold text-gray-800">AdminProducts</h1>
        {/* TODO: AdminProducts content here */}
      </main>
    </div>
  );
};

export default AdminProducts;
