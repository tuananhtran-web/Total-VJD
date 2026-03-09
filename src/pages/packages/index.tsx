import React, { useEffect, useState } from "react";
import { Page, Header, Box, Tabs, Text, Icon } from "zmp-ui";
import { PackageService, Package, PackageCategory } from "../../services/package-service";
import { PackageCard } from "../../components/package-card";

const UserPackageListPage: React.FC = () => {
  const [categories, setCategories] = useState<PackageCategory[]>([]);
  const [packages, setPackages] = useState<Package[]>([]);
  const [activeTab, setActiveTab] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const [cats, pkgs] = await Promise.all([
        PackageService.getCategories(),
        PackageService.getAllPackages()
      ]);
      setCategories(cats);
      setPackages(pkgs);
      setLoading(false);
    };
    fetchData();
  }, []);

  const filteredPackages = activeTab === "all" 
    ? packages 
    : packages.filter(p => p.categoryId === activeTab);

  if (loading) return <Page className="flex justify-center items-center">Đang tải...</Page>;

  return (
    <Page className="bg-gray-50 pb-20">
      <Header title="Gói tập & Dịch vụ" />

      {/* Categories Tabs */}
      <div className="bg-white sticky top-0 z-10 shadow-sm">
        <Tabs 
          scrollable 
          activeKey={activeTab} 
          onChange={(key) => setActiveTab(key)}
          className="no-border-tabs"
        >
          <Tabs.Tab key="all" label="Tất cả" />
          {categories.map(cat => (
            <Tabs.Tab key={cat.id} label={cat.name} />
          ))}
        </Tabs>
      </div>

      {/* Banner Area (Optional - Dynamic based on active category?) */}
      <Box className="p-4">
        {filteredPackages.map((pkg) => (
          <PackageCard key={pkg.id} pkg={pkg} />
        ))}
        {filteredPackages.length === 0 && (
           <div className="text-center py-10 text-gray-400">
             <Text>Chưa có gói tập nào trong danh mục này</Text>
           </div>
        )}
      </Box>
    </Page>
  );
};

export default UserPackageListPage;
