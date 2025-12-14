"use client";

import { useEffect, useState } from "react";
import { UserList } from "@/components/dashboard/user-list";
import { QuickActions } from "@/components/dashboard/quick-actions";
import type { UserCreditProfile } from "@/lib/types";

export default function UsersPage() {
  const [users, setUsers] = useState<UserCreditProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/generate-data?count=50");
      const data = await response.json();
      setUsers(data.users || []);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <div className="text-lg font-semibold">Loading users...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Users</h1>
          <p className="text-muted-foreground">
            Manage and monitor all user credit profiles
          </p>
        </div>
        <QuickActions onRefresh={loadData} onGenerateData={loadData} />
      </div>

      <UserList users={users} />
    </div>
  );
}
