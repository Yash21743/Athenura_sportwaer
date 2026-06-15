import AdminSidebar from '../common/adminlayout/AdminSidebar';

const AdminBulkOrders = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />
      <main className="flex-1 p-8">
        <h1 className="text-3xl font-bold text-gray-800">AdminBulkOrders</h1>
        {/* TODO: AdminBulkOrders content here */}
      </main>
    </div>
  );
};

export default AdminBulkOrders;
