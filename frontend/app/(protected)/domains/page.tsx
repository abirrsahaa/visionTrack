"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { api } from "@/lib/api";
import { queryKeys } from "@/lib/query/queryClient";
import { DomainList } from "@/components/domains/DomainList";
import { DomainEditor } from "@/components/domains/DomainEditor";
import { SystemButton } from "@/components/shared/SystemButton";
import { SystemPanel } from "@/components/shared/SystemPanel";
import { Modal } from "@/components/shared/Modal";
import { Plus } from "lucide-react";
import type { Domain } from "@/lib/types";

export default function DomainsPage() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingDomain, setEditingDomain] = useState<Domain | null>(null);
  const queryClient = useQueryClient();

  const { data: domains, isLoading } = useQuery({
    queryKey: queryKeys.domains.all,
    queryFn: api.domains.getAll,
  });

  const { mutate: deleteDomain } = useMutation({
    mutationFn: api.domains.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.domains.all });
    },
  });

  const handleEdit = (domain: Domain) => {
    setEditingDomain(domain);
    setShowCreateModal(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this domain? This will also delete all associated images and goals.")) {
      deleteDomain(id);
    }
  };

  const handleCloseModal = () => {
    setShowCreateModal(false);
    setEditingDomain(null);
  };

  return (
    <div className="min-h-screen bg-background space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center"
      >
        <div>
          <h1 className="font-mono text-2xl font-bold text-arch-dark-text-primary mb-2 uppercase tracking-wider">
            LIFE DOMAINS
          </h1>
          <p className="font-mono text-xs text-arch-dark-text-tertiary">
            Organize your life into domains that matter most
          </p>
        </div>
        <SystemButton
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          CREATE DOMAIN
        </SystemButton>
      </motion.div>

      {/* Domain List */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <SystemPanel key={i} className="animate-pulse">
              <div className="h-48 bg-arch-dark-bg-tertiary rounded-lg mb-4" />
              <div className="h-4 bg-arch-dark-bg-tertiary rounded w-3/4 mb-2" />
              <div className="h-3 bg-arch-dark-bg-tertiary rounded w-full" />
            </SystemPanel>
          ))}
        </div>
      ) : domains && domains.length > 0 ? (
        <DomainList
          domains={domains}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      ) : (
        <SystemPanel>
          <div className="text-center py-12">
            <p className="font-mono text-sm text-arch-dark-text-secondary mb-4">NO DOMAINS YET</p>
            <p className="font-sans text-sm text-arch-dark-text-tertiary mb-6">
              Create your first life domain to get started on your vision journey
            </p>
            <SystemButton onClick={() => setShowCreateModal(true)}>
              CREATE YOUR FIRST DOMAIN
            </SystemButton>
          </div>
        </SystemPanel>
      )}

      {/* Create/Edit Modal */}
      <Modal
        open={showCreateModal}
        onClose={handleCloseModal}
        title={editingDomain ? "EDIT DOMAIN" : "CREATE NEW DOMAIN"}
        size="lg"
      >
        <DomainEditor
          domain={editingDomain || undefined}
          onSuccess={handleCloseModal}
          onCancel={handleCloseModal}
        />
      </Modal>
    </div>
  );
}
