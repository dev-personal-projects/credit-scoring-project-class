"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { UserCreditProfile } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";

interface UserListProps {
  users: UserCreditProfile[];
}

export function UserList({ users: initialUsers }: UserListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "score" | "risk" | "status">(
    "name"
  );
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const filteredUsers = initialUsers.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    let comparison = 0;
    switch (sortBy) {
      case "name":
        comparison = a.name.localeCompare(b.name);
        break;
      case "score":
        comparison = a.currentCreditScore - b.currentCreditScore;
        break;
      case "risk":
        const riskOrder = { low: 0, medium: 1, high: 2 };
        comparison = riskOrder[a.riskLevel] - riskOrder[b.riskLevel];
        break;
      case "status":
        comparison = a.status.localeCompare(b.status);
        break;
    }
    return sortOrder === "asc" ? comparison : -comparison;
  });

  const handleSort = (field: typeof sortBy) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 750) return "text-green-600 dark:text-green-400";
    if (score >= 700) return "text-blue-600 dark:text-blue-400";
    if (score >= 650) return "text-yellow-600 dark:text-yellow-400";
    if (score >= 580) return "text-orange-600 dark:text-orange-400";
    return "text-red-600 dark:text-red-400";
  };

  const getRiskBadgeVariant = (risk: string) => {
    if (risk === "low") return "default";
    if (risk === "medium") return "secondary";
    return "destructive";
  };

  const getStatusBadgeVariant = (status: string) => {
    if (status === "active") return "default";
    if (status === "inactive") return "secondary";
    return "destructive";
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search users by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSort("name")}
                  className="h-8 px-2 font-semibold"
                >
                  Name
                  {sortBy === "name" && (sortOrder === "asc" ? " ↑" : " ↓")}
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSort("score")}
                  className="h-8 px-2 font-semibold"
                >
                  Credit Score
                  {sortBy === "score" && (sortOrder === "asc" ? " ↑" : " ↓")}
                </Button>
              </TableHead>
              <TableHead>Debt-to-Income</TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSort("risk")}
                  className="h-8 px-2 font-semibold"
                >
                  Risk Level
                  {sortBy === "risk" && (sortOrder === "asc" ? " ↑" : " ↓")}
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSort("status")}
                  className="h-8 px-2 font-semibold"
                >
                  Status
                  {sortBy === "status" && (sortOrder === "asc" ? " ↑" : " ↓")}
                </Button>
              </TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedUsers.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center text-muted-foreground"
                >
                  No users found
                </TableCell>
              </TableRow>
            ) : (
              sortedUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>
                    <span
                      className={cn(
                        "font-bold",
                        getScoreColor(user.currentCreditScore)
                      )}
                    >
                      {user.currentCreditScore}
                    </span>
                  </TableCell>
                  <TableCell>
                    {(user.debtToIncomeRatio * 100).toFixed(1)}%
                  </TableCell>
                  <TableCell>
                    <Badge variant={getRiskBadgeVariant(user.riskLevel)}>
                      {user.riskLevel.toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(user.status)}>
                      {user.status.toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Link href={`/dashboard/users/${user.id}`}>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
