'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  FileText, 
  Sparkles, 
  Plus, 
  Copy, 
  Check, 
  Tag, 
  Search,
  Zap,
  ArrowRight,
  Edit2,
  Trash2,
  X,
  ExternalLink,
  MessageSquare
} from 'lucide-react';
import { DashboardSidebar } from '@/components/layout/dashboard-sidebar';
import { DashboardTopNav } from '@/components/layout/dashboard-top-nav';
import { useApp } from '@/context/app-context';
import { Template } from '@/types';

type TemplateCategory = 'PRICE_ENQUIRY' | 'PRODUCT_INFO' | 'LEAD_ENQUIRY' | 'FAQ' | 'BUSINESS_HOURS' | 'CREATOR_RESOURCE';

export default function TemplatesPage() {
  const router = useRouter();
  const { 
    templates, 
    createTemplate, 
    updateTemplate, 
    deleteTemplate, 
    createAutomation, 
    activeAccount, 
    user 
  } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Modal State for Create & Edit
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form State
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState<TemplateCategory>('PRICE_ENQUIRY');
  const [formDescription, setFormDescription] = useState('');
  const [formKeywords, setFormKeywords] = useState('');
  const [formReplyText, setFormReplyText] = useState('');
  const [formActionType, setFormActionType] = useState<'SEND_DM' | 'SEND_LINK'>('SEND_LINK');
  const [formLinkUrl, setFormLinkUrl] = useState('');
  const [formLinkLabel, setFormLinkLabel] = useState('');

  const categories = [
    { id: 'ALL', label: 'All Templates' },
    { id: 'PRICE_ENQUIRY', label: 'Pricing & Cost' },
    { id: 'LEAD_ENQUIRY', label: 'Lead Capture & Calls' },
    { id: 'CREATOR_RESOURCE', label: 'Creator Freebies' },
    { id: 'BUSINESS_HOURS', label: 'Hours & Support' },
    { id: 'FAQ', label: 'FAQ & Help' },
    { id: 'PRODUCT_INFO', label: 'Product Info' },
  ];

  const filtered = templates.filter((t) => {
    const matchesCategory = selectedCategory === 'ALL' || t.category === selectedCategory;
    const matchesSearch = searchQuery.trim() === '' || 
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.configuration.trigger_keywords.some((k) => k.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleOpenCreate = () => {
    setEditingTemplate(null);
    setFormName('');
    setFormCategory('PRICE_ENQUIRY');
    setFormDescription('');
    setFormKeywords('');
    setFormReplyText('');
    setFormActionType('SEND_DM');
    setFormLinkUrl('');
    setFormLinkLabel('');
    setModalOpen(true);
  };

  const handleOpenEdit = (tpl: Template) => {
    setEditingTemplate(tpl);
    setFormName(tpl.name);
    setFormCategory(tpl.category);
    setFormDescription(tpl.description);
    setFormKeywords(tpl.configuration.trigger_keywords.join(', '));
    setFormReplyText(tpl.configuration.reply_text);
    setFormActionType(tpl.configuration.action_type || 'SEND_DM');
    setFormLinkUrl(tpl.configuration.link_url || '');
    setFormLinkLabel(tpl.configuration.link_label || '');
    setModalOpen(true);
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    const keywordsArray = formKeywords
      .split(',')
      .map((k) => k.trim())
      .filter((k) => k.length > 0);

    const templatePayload = {
      name: formName.trim(),
      category: formCategory,
      description: formDescription.trim(),
      user_id: user.id || null,
      configuration: {
        trigger_keywords: keywordsArray.length > 0 ? keywordsArray : ['info'],
        reply_text: formReplyText.trim(),
        action_type: formActionType,
        link_url: formActionType === 'SEND_LINK' ? formLinkUrl.trim() : undefined,
        link_label: formActionType === 'SEND_LINK' ? formLinkLabel.trim() : undefined,
      },
    };

    if (editingTemplate) {
      updateTemplate(editingTemplate.id, templatePayload);
    } else {
      createTemplate(templatePayload);
    }

    setModalOpen(false);
  };

  const handleDelete = (id: string) => {
    deleteTemplate(id);
    setDeleteConfirmId(null);
  };

  const handleApplyTemplate = (tpl: Template) => {
    createAutomation({
      user_id: user.id,
      instagram_account_id: activeAccount?.id || 'acc-1',
      name: `${tpl.name}`,
      description: tpl.description,
      trigger_type: 'KEYWORD_MATCH',
      status: 'ACTIVE',
      configuration: {
        trigger: { type: 'KEYWORD_MATCH' },
        conditions: [
          {
            id: `c-${Date.now()}`,
            type: 'KEYWORD',
            matchType: 'CONTAINS',
            keywords: tpl.configuration.trigger_keywords,
          },
        ],
        actions: [
          {
            id: `a-${Date.now()}`,
            type: tpl.configuration.action_type,
            content: tpl.configuration.reply_text,
            linkUrl: tpl.configuration.link_url,
            linkLabel: tpl.configuration.link_label,
          },
        ],
        stats: {
          triggeredCount: 0,
          repliedCount: 0,
          failedCount: 0,
        },
      },
    });

    setCopiedId(tpl.id);
    setTimeout(() => {
      setCopiedId(null);
      router.push('/dashboard/automations');
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#FFF5F7] text-[#1F1216] flex">
      <DashboardSidebar />

      <div className="flex-1 ml-64 min-w-0 flex flex-col">
        <DashboardTopNav title="Automation Templates" />

        <main className="p-6 sm:p-8 space-y-6 flex-1 max-w-7xl mx-auto w-full">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-[#1F1216] tracking-tight">Playbook & Template Hub</h2>
              <p className="text-xs sm:text-sm text-[#6B4E58] mt-1 font-medium">
                Create, customize, and deploy one-click DM playbooks to convert chats into sales.
              </p>
            </div>

            <button
              onClick={handleOpenCreate}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold text-white rose-button-primary shadow-lg shadow-[#F43F5E]/20 self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              Create Custom Template
            </button>
          </div>

          {/* Search & Category Pill Filters */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              {categories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCategory(c.id)}
                  className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all shadow-xs ${
                    selectedCategory === c.id
                      ? 'bg-[#F43F5E] text-white shadow-md'
                      : 'bg-[#FFFFFF] border border-[#FED7E2] text-[#6B4E58] hover:text-[#1F1216]'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>

            <div className="relative min-w-[240px]">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9E7D88]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search templates & keywords..."
                className="w-full pl-9 pr-4 py-2 rounded-2xl bg-[#FFFFFF] border border-[#FED7E2] text-xs font-semibold text-[#1F1216] focus:outline-none focus:border-[#F43F5E] shadow-xs"
              />
            </div>
          </div>

          {/* Template Cards Grid */}
          {filtered.length === 0 ? (
            <div className="p-12 text-center rounded-3xl border border-[#FED7E2] bg-[#FFFFFF] shadow-sm space-y-4">
              <div className="w-16 h-16 rounded-3xl bg-[#FFF0F4] text-[#F43F5E] flex items-center justify-center mx-auto">
                <FileText className="w-8 h-8" />
              </div>
              <h3 className="text-base font-black text-[#1F1216]">No Templates Found</h3>
              <p className="text-xs text-[#6B4E58] max-w-md mx-auto font-medium">
                No templates matched your current filter. Create your first custom automation template now!
              </p>
              <button
                onClick={handleOpenCreate}
                className="px-6 py-2.5 rounded-2xl text-xs font-bold text-white rose-button-primary shadow-md inline-flex items-center gap-2"
              >
                <Plus className="w-4 h-4" /> Create Template
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((tpl) => (
                <div
                  key={tpl.id}
                  className="p-6 sm:p-7 rounded-3xl border border-[#FED7E2] bg-[#FFFFFF] flex flex-col justify-between hover:border-[#F43F5E] transition-all space-y-4 shadow-sm"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-[#FFE4E6] border border-[#FECDD3] text-[#E11D48]">
                        {tpl.category.replace('_', ' ')}
                      </span>

                      {/* Edit & Delete Controls */}
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleOpenEdit(tpl)}
                          className="p-1.5 rounded-xl text-[#6B4E58] hover:text-[#E11D48] hover:bg-[#FFF0F4] transition-colors"
                          title="Edit Template"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(tpl.id)}
                          className="p-1.5 rounded-xl text-[#6B4E58] hover:text-[#EF4444] hover:bg-[#FEE2E2] transition-colors"
                          title="Delete Template"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <h3 className="font-extrabold text-base text-[#1F1216] mb-1.5">{tpl.name}</h3>
                    <p className="text-xs text-[#6B4E58] leading-relaxed mb-4 font-medium line-clamp-2">{tpl.description}</p>

                    <div className="space-y-2">
                      <p className="text-[11px] font-bold text-[#9E7D88] uppercase tracking-wider">Trigger Keywords:</p>
                      <div className="flex flex-wrap gap-1.5">
                        {tpl.configuration.trigger_keywords.map((kw, i) => (
                          <span key={i} className="px-2.5 py-0.5 rounded-lg bg-[#FFF0F4] border border-[#FED7E2] text-[10px] font-mono font-bold text-[#E11D48]">
                            "{kw}"
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="mt-4 p-3.5 rounded-2xl bg-[#FFF5F7] border border-[#FED7E2]">
                      <p className="text-[10px] text-[#9E7D88] uppercase tracking-wider font-bold mb-1">Reply Blueprint:</p>
                      <p className="text-xs text-[#6B4E58] italic line-clamp-2 font-medium">{tpl.configuration.reply_text}</p>
                      {tpl.configuration.link_url && (
                        <div className="mt-2 pt-2 border-t border-[#FED7E2] flex items-center gap-1.5 text-[11px] font-bold text-[#E11D48] truncate">
                          <ExternalLink className="w-3 h-3 flex-shrink-0" />
                          <span className="truncate">{tpl.configuration.link_label || tpl.configuration.link_url}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={() => handleApplyTemplate(tpl)}
                      className="w-full py-3 rounded-2xl text-xs font-bold text-white rose-button-primary shadow hover:opacity-95 transition-all flex items-center justify-center gap-2"
                    >
                      {copiedId === tpl.id ? (
                        <>
                          <Check className="w-4 h-4 text-[#10B981]" /> Applied to Dashboard!
                        </>
                      ) : (
                        <>
                          <Zap className="w-4 h-4" /> Use This Template
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Delete Confirmation Modal */}
          {deleteConfirmId && (
            <div 
              className="fixed inset-0 z-50 bg-[#1F1216]/60 backdrop-blur-sm flex items-center justify-center p-4"
              onClick={(e) => {
                if (e.target === e.currentTarget) setDeleteConfirmId(null);
              }}
            >
              <div className="w-full max-w-sm rounded-3xl border border-[#FECDD3] bg-[#FFFFFF] p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
                <div className="w-12 h-12 rounded-2xl bg-[#FEE2E2] text-[#EF4444] flex items-center justify-center mx-auto">
                  <Trash2 className="w-6 h-6" />
                </div>
                <div className="text-center">
                  <h3 className="font-extrabold text-base text-[#1F1216]">Delete This Template?</h3>
                  <p className="text-xs text-[#6B4E58] mt-1 font-medium">
                    This template will be removed from your playbook library. Existing active automations will remain unaffected.
                  </p>
                </div>
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => setDeleteConfirmId(null)}
                    className="flex-1 py-2.5 rounded-2xl text-xs font-bold text-[#6B4E58] bg-[#FFF0F4] hover:bg-[#FFE4E6]"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleDelete(deleteConfirmId)}
                    className="flex-1 py-2.5 rounded-2xl text-xs font-bold text-white bg-[#EF4444] hover:bg-[#DC2626] shadow-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Create / Edit Template Modal */}
          {modalOpen && (
            <div 
              className="fixed inset-0 z-50 bg-[#1F1216]/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
              onClick={(e) => {
                if (e.target === e.currentTarget) setModalOpen(false);
              }}
            >
              <div className="w-full max-w-lg rounded-3xl border border-[#FED7E2] bg-[#FFFFFF] p-6 sm:p-8 shadow-2xl my-8 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between pb-4 border-b border-[#FED7E2]">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-[#FFE4E6] flex items-center justify-center text-[#F43F5E]">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-[#1F1216] text-base">
                        {editingTemplate ? 'Edit Template' : 'Create Custom Template'}
                      </h3>
                      <p className="text-[11px] text-[#6B4E58]">Saved to your Supabase template library</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setModalOpen(false)} 
                    className="p-1 rounded-lg text-[#6B4E58] hover:text-[#1F1216] hover:bg-[#FFF0F4]"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSubmitForm} className="mt-4 space-y-4 text-xs font-medium text-[#6B4E58]">
                  <div>
                    <label className="block text-xs font-bold text-[#1F1216] mb-1">Template Name</label>
                    <input
                      type="text"
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      placeholder="e.g. VIP Consultation Offer"
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFF5F7] border border-[#FED7E2] text-xs font-semibold text-[#1F1216] focus:outline-none focus:border-[#F43F5E]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#1F1216] mb-1">Category</label>
                      <select
                        value={formCategory}
                        onChange={(e) => setFormCategory(e.target.value as TemplateCategory)}
                        className="w-full px-3 py-2.5 rounded-xl bg-[#FFF5F7] border border-[#FED7E2] text-xs font-bold text-[#1F1216]"
                      >
                        <option value="PRICE_ENQUIRY">Pricing & Cost</option>
                        <option value="LEAD_ENQUIRY">Lead Capture & Calls</option>
                        <option value="CREATOR_RESOURCE">Creator Freebies</option>
                        <option value="BUSINESS_HOURS">Hours & Support</option>
                        <option value="FAQ">FAQ & Help</option>
                        <option value="PRODUCT_INFO">Product Info</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#1F1216] mb-1">Action Type</label>
                      <select
                        value={formActionType}
                        onChange={(e) => setFormActionType(e.target.value as 'SEND_DM' | 'SEND_LINK')}
                        className="w-full px-3 py-2.5 rounded-xl bg-[#FFF5F7] border border-[#FED7E2] text-xs font-bold text-[#1F1216]"
                      >
                        <option value="SEND_DM">Plain Direct Message</option>
                        <option value="SEND_LINK">DM with Action Link Button</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#1F1216] mb-1">Description</label>
                    <input
                      type="text"
                      value={formDescription}
                      onChange={(e) => setFormDescription(e.target.value)}
                      placeholder="Brief summary of when to use this playbook"
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFF5F7] border border-[#FED7E2] text-xs font-semibold text-[#1F1216] focus:outline-none focus:border-[#F43F5E]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#1F1216] mb-1">
                      Trigger Keywords (Comma separated)
                    </label>
                    <input
                      type="text"
                      value={formKeywords}
                      onChange={(e) => setFormKeywords(e.target.value)}
                      placeholder="price, cost, rates, quote, booking"
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFF5F7] border border-[#FED7E2] text-xs font-mono font-semibold text-[#1F1216] focus:outline-none focus:border-[#F43F5E]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#1F1216] mb-1">Reply Blueprint Message</label>
                    <textarea
                      rows={3}
                      value={formReplyText}
                      onChange={(e) => setFormReplyText(e.target.value)}
                      placeholder="Hey! Thanks for inquiring. Here is our direct link..."
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFF5F7] border border-[#FED7E2] text-xs font-semibold text-[#1F1216] focus:outline-none focus:border-[#F43F5E]"
                    />
                  </div>

                  {formActionType === 'SEND_LINK' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-3.5 rounded-2xl bg-[#FFF5F7] border border-[#FED7E2]">
                      <div>
                        <label className="block text-xs font-bold text-[#1F1216] mb-1">Link URL</label>
                        <input
                          type="url"
                          value={formLinkUrl}
                          onChange={(e) => setFormLinkUrl(e.target.value)}
                          placeholder="https://techiedmtool.com/vip"
                          required
                          className="w-full px-3 py-2 rounded-xl bg-[#FFFFFF] border border-[#FED7E2] text-xs font-semibold text-[#1F1216] focus:outline-none focus:border-[#F43F5E]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-[#1F1216] mb-1">Button Label</label>
                        <input
                          type="text"
                          value={formLinkLabel}
                          onChange={(e) => setFormLinkLabel(e.target.value)}
                          placeholder="Claim Access Now"
                          required
                          className="w-full px-3 py-2 rounded-xl bg-[#FFFFFF] border border-[#FED7E2] text-xs font-semibold text-[#1F1216] focus:outline-none focus:border-[#F43F5E]"
                        />
                      </div>
                    </div>
                  )}

                  <div className="pt-3 flex justify-end gap-2 border-t border-[#FED7E2]">
                    <button
                      type="button"
                      onClick={() => setModalOpen(false)}
                      className="px-4 py-2.5 rounded-xl text-xs font-bold text-[#6B4E58] hover:text-[#1F1216] bg-[#FFF0F4]"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-2xl text-xs font-bold text-white rose-button-primary shadow-md hover:opacity-95"
                    >
                      {editingTemplate ? 'Save Changes' : 'Create Template'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
