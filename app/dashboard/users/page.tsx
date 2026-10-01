"use client";

import { useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Card, EmptyState } from "@/components/ui/card";
import { Select } from "@/components/ui/field";
import { useAuth } from "@/lib/auth-context";
import { db } from "@/lib/firebase";
import { useCollection } from "@/lib/firestore";
import type { UserProfile, UserRole } from "@/lib/types";

const roles: UserRole[] = ["admin", "manager", "operator"];

export default function UsersPage() {
  const { user, profile } = useAuth();
  const { data: users, loading, error } = useCollection<UserProfile>("users", {
    orderByField: "createdAt",
    direction: "asc",
  });
  const [actionError, setActionError] = useState("");
  const isAdmin = profile?.role === "admin";

  const changeRole = async (id: string, role: UserRole) => {
    setActionError("");
    try {
      await updateDoc(doc(db, "users", id), { role });
    } catch {
      setActionError("Couldn't update that role.");
    }
  };

  return (
    <>
      <PageHeader
        title="Users"
        description={
          isAdmin
            ? "Manage who can access the dashboard and what they can do."
            : "System operators. Only admins can change roles."
        }
      />

      {(error || actionError) && (
        <p role="alert" className="mb-6 text-sm text-red-700 dark:text-red-400">
          {error || actionError}
        </p>
      )}

      <Card className="overflow-hidden">
        {users.length === 0 ? (
          <EmptyState>{loading ? "Loading users…" : "No users yet."}</EmptyState>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-800/80 text-xs tracking-wide text-slate-500 uppercase">
                  <th className="px-6 py-4 font-medium">Operator</th>
                  <th className="px-6 py-4 font-medium">Joined</th>
                  <th className="px-6 py-4 font-medium">Role</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {users.map((entry) => {
                  const isSelf = entry.id === user?.uid;
                  return (
                    <tr key={entry.id}>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-slate-800 text-sm font-semibold text-slate-300">
                            {(entry.displayName || entry.email).charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium text-slate-100">
                              {entry.displayName}
                              {isSelf && <span className="ml-2 text-xs text-slate-500">You</span>}
                            </p>
                            <p className="text-slate-500">{entry.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-400">
                        {new Date(entry.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </td>
                      <td className="px-6 py-4">
                        <Select
                          value={entry.role}
                          disabled={!isAdmin || isSelf}
                          aria-label={`Role for ${entry.displayName}`}
                          onChange={(event) => void changeRole(entry.id, event.target.value as UserRole)}
                          className="h-9 w-36 capitalize"
                        >
                          {roles.map((role) => (
                            <option key={role} value={role}>
                              {role}
                            </option>
                          ))}
                        </Select>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </>
  );
}
