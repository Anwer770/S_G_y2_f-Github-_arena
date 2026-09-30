import React from 'react';
import { ShieldAlert } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import {
  ActiveModuleTab,
  AppSettings,
  Commitment,
  Customer,
  CustomerAuditLog,
  CustomerVisitRecord,
  DoctorAuditLog,
  DoctorRecord,
  DoctorVisitLog,
  FinancialTransaction,
  Item,
  Movement,
  ProductStock,
  Task,
  TaskAuditLog,
  UnifiedBackupState,
} from '../../types';

// Lazy loaded modules for fast startup
const FinancialModule = React.lazy(() =>
  import('../../components/financial/FinancialModule').then((m) => ({ default: m.FinancialModule }))
);
const DebtsModule = React.lazy(() =>
  import('../../components/debts/DebtsModule').then((m) => ({ default: m.DebtsModule }))
);
const KnowledgeModule = React.lazy(() =>
  import('../../components/knowledge/KnowledgeModule').then((m) => ({ default: m.KnowledgeModule }))
);
const StockModule = React.lazy(() =>
  import('../../components/stock/StockModule').then((m) => ({ default: m.StockModule }))
);
const CustomersModule = React.lazy(() =>
  import('../../components/customers/CustomersModule').then((m) => ({ default: m.CustomersModule }))
);
const DoctorsModule = React.lazy(() =>
  import('../../components/doctors/DoctorsModule').then((m) => ({ default: m.DoctorsModule }))
);
const RoutinesModule = React.lazy(() =>
  import('../../components/routines/RoutinesModule').then((m) => ({ default: m.RoutinesModule }))
);
const CustodyIssuesModule = React.lazy(() =>
  import('../../components/custody/CustodyIssuesModule').then((m) => ({ default: m.CustodyIssuesModule }))
);
const LinksLibraryModule = React.lazy(() =>
  import('../../components/links/LinksLibraryModule').then((m) => ({ default: m.LinksLibraryModule }))
);
const WorkOSModule = React.lazy(() =>
  import('../../components/workos/WorkOSModule').then((m) => ({ default: m.WorkOSModule }))
);
const UnifiedSettings = React.lazy(() =>
  import('../../components/settings/UnifiedSettings').then((m) => ({ default: m.UnifiedSettings }))
);
const UnifiedDashboard = React.lazy(() =>
  import('../../components/dashboard/UnifiedDashboard').then((m) => ({ default: m.UnifiedDashboard }))
);

import { loadDebts, loadDebtCommitments, loadCustodyIssues, loadLinksRecords, saveTaskAuditLogs } from '../../utils/storage';

export interface AppRouterProps {
  activeTab: ActiveModuleTab;
  setActiveTab: (tab: ActiveModuleTab) => void;
  // Stock props
  products: Item[];
  records: Movement[];
  categories: string[];
  statuses: string[];
  settings: AppSettings;
  seq: { IN: number; OUT: number };
  stockAuditLogs: any[];
  stocks: ProductStock[];
  onSaveMovement: (record: Movement) => void;
  onDeleteRecord: (record: Movement) => void;
  onBulkDelete: (subIds: string[]) => void;
  onCloneRecord: (record: Movement) => void;
  onAddProduct: (product: Item) => void;
  onEditProduct: (oldName: string, updatedProduct: Item) => void;
  onDeleteProduct: (product: Item) => void;
  onToggleProductActive: (product: Item) => void;
  // Financial props
  financialTransactions: FinancialTransaction[];
  movements: string[];
  restrictions: string[];
  movementTypes: string[];
  importanceList: string[];
  categoryAccounts: string[];
  restrictionAccounts: string[];
  accountNames: string[];
  onSaveFinancialTxn: (txn: FinancialTransaction) => void;
  onDeleteFinancialTxn: (id: string) => void;
  onImportFinancialTxns: (txns: FinancialTransaction[], mode: 'append' | 'replace') => void;
  onAddFinancialOption: (type: any, val: string) => void;
  // Tasks props
  tasks: Task[];
  commitments: Commitment[];
  taskCategories: string[];
  taskOperations: string[];
  taskAssignees: string[];
  taskAuditLogs: TaskAuditLog[];
  onSaveTask: (task: Task) => void;
  onDeleteTask: (id: string) => void;
  onToggleCompleteTask: (id: string) => void;
  onSaveCommitment: (comm: Commitment) => void;
  onDeleteCommitment: (id: string) => void;
  onToggleCompleteCommitment: (id: string) => void;
  onClearCompletedTasks: () => void;
  setTaskAuditLogs: (logs: TaskAuditLog[]) => void;
  // Customers props
  customers: Customer[];
  customerVisits: CustomerVisitRecord[];
  customerAuditLogs: CustomerAuditLog[];
  onUpdateCustomers: (customers: Customer[]) => void;
  onUpdateVisits: (visits: CustomerVisitRecord[]) => void;
  // Doctors props
  doctors: DoctorRecord[];
  doctorVisits: DoctorVisitLog[];
  doctorAuditLogs: DoctorAuditLog[];
  onUpdateDoctors: (doctors: DoctorRecord[]) => void;
  onUpdateDoctorVisits: (visits: DoctorVisitLog[]) => void;
  logDoctorAudit: (action: string, entity: string, name: string, details?: string) => void;
  // Settings & Backup props
  onExportBackup: () => UnifiedBackupState;
  onImportBackup: (backup: UnifiedBackupState) => void;
  onResetAllData: () => void;
  routinesCount: number;
  debtsCount: number;
  debtCommitmentsCount: number;
}

export const AppRouter: React.FC<AppRouterProps> = (props) => {
  const { activeTab, setActiveTab } = props;
  const { canAccessModule, currentUser } = useAuth();

  if (!canAccessModule(activeTab)) {
    return (
      <div className="py-20 px-4 text-center max-w-md mx-auto space-y-4" dir="rtl">
        <div className="w-16 h-16 rounded-3xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/60 flex items-center justify-center mx-auto shadow-sm">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <div className="space-y-1">
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
            غير مصرح لحسابك بالوصول إلى هذا القسم
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            المستخدم الحالي ({currentUser?.name || 'مستخدم'} - {currentUser?.role}) ليس لديه الصلاحيات المقررة لعرض قسم "{activeTab}". تم تأمين السجلات المالية والإدارية الحساسة.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setActiveTab('dashboard')}
          className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white font-bold rounded-xl text-xs transition cursor-pointer shadow-xs"
        >
          العودة إلى لوحة التحكم
        </button>
      </div>
    );
  }

  return (
    <React.Suspense
      fallback={
        <div className="flex flex-col items-center justify-center py-28 space-y-4">
          <div className="w-10 h-10 border-4 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs font-bold text-slate-500 dark:text-slate-400">جاري تحميل الشاشة...</p>
        </div>
      }
    >
      {/* 1. DASHBOARD */}
      {activeTab === 'dashboard' && (
        <UnifiedDashboard
          items={props.products}
          movements={props.records}
          financialTransactions={props.financialTransactions}
          debts={loadDebts()}
          debtCommitments={loadDebtCommitments()}
          tasks={props.tasks}
          commitments={props.commitments}
          customers={props.customers}
          visits={props.customerVisits}
          doctors={props.doctors}
          doctorVisits={props.doctorVisits}
          onNavigateTab={(tab) => setActiveTab(tab)}
          onSaveFinancialTxn={props.onSaveFinancialTxn}
          onSaveMovement={props.onSaveMovement}
          onSaveTask={props.onSaveTask}
          onToggleCompleteTask={props.onToggleCompleteTask}
          onSaveCommitment={props.onSaveCommitment}
          onUpdateCustomers={props.onUpdateCustomers}
          onUpdateVisits={props.onUpdateVisits}
          categories={props.categories}
          statuses={props.statuses}
          seq={props.seq}
          financialMovements={props.movements}
          restrictions={props.restrictions}
          movementTypes={props.movementTypes}
          importanceList={props.importanceList}
          categoryAccounts={props.categoryAccounts}
          restrictionAccounts={props.restrictionAccounts}
          accountNames={props.accountNames}
          onAddFinancialOption={props.onAddFinancialOption}
          taskCategories={props.taskCategories}
          taskOperations={props.taskOperations}
          taskAssignees={props.taskAssignees}
        />
      )}

      {/* 2. WORK OS UNIFIED (Projects, Tasks, Kanban, Timeline, Matrix, Workload) */}
      {(activeTab === 'workos' || activeTab === 'tasks' || activeTab === 'taskflow') && (
        <WorkOSModule
          initialView={
            activeTab === 'taskflow' ? 'taskflow' : activeTab === 'tasks' ? 'tasks' : 'dashboard'
          }
          onNavigateToERP={(tab) => setActiveTab(tab as any)}
          tasks={props.tasks}
          commitments={props.commitments}
          categories={props.taskCategories}
          operations={props.taskOperations}
          assignees={props.taskAssignees}
          auditLogs={props.taskAuditLogs}
          onSaveTask={props.onSaveTask}
          onDeleteTask={props.onDeleteTask}
          onToggleCompleteTask={props.onToggleCompleteTask}
          onSaveCommitment={props.onSaveCommitment}
          onDeleteCommitment={props.onDeleteCommitment}
          onToggleCompleteCommitment={props.onToggleCompleteCommitment}
          onClearCompletedTasks={props.onClearCompletedTasks}
          onClearAuditLogs={() => {
            saveTaskAuditLogs([]);
            props.setTaskAuditLogs([]);
          }}
        />
      )}

      {/* 3. SMART LINKS LIBRARY */}
      {activeTab === 'links' && <LinksLibraryModule />}

      {/* 4. CUSTODY & PENDING ISSUES */}
      {activeTab === 'custody' && <CustodyIssuesModule />}

      {/* 5. ROUTINES & HABITS */}
      {activeTab === 'routines' && <RoutinesModule />}

      {/* 6. FINANCIAL LEDGER */}
      {activeTab === 'financial' && (
        <FinancialModule
          transactions={props.financialTransactions}
          movements={props.movements}
          restrictions={props.restrictions}
          movementTypes={props.movementTypes}
          importanceList={props.importanceList}
          categoryAccounts={props.categoryAccounts}
          restrictionAccounts={props.restrictionAccounts}
          accountNames={props.accountNames}
          onSaveTransaction={props.onSaveFinancialTxn}
          onDeleteTransaction={props.onDeleteFinancialTxn}
          onImportTransactions={props.onImportFinancialTxns}
          onAddOption={props.onAddFinancialOption}
        />
      )}

      {/* 7. DEBTS & COMMITMENTS */}
      {activeTab === 'debts' && <DebtsModule />}

      {/* 8. KNOWLEDGE & NOTES */}
      {activeTab === 'knowledge' && (
        <KnowledgeModule
          customersList={props.customers.map((c) => ({ id: c.id, name: c.name }))}
          doctorsList={props.doctors.map((d) => ({ id: d.id, name: d.doctorName }))}
          tasksList={props.tasks.map((t) => ({ id: t.id, title: t.title }))}
        />
      )}

      {/* 9. STOCK LEDGER */}
      {activeTab === 'stock' && (
        <StockModule
          products={props.products}
          records={props.records}
          categories={props.categories}
          statuses={props.statuses}
          settings={props.settings}
          seq={props.seq}
          auditLogs={props.stockAuditLogs}
          stocks={props.stocks}
          onSaveMovement={props.onSaveMovement}
          onDeleteRecord={props.onDeleteRecord}
          onBulkDelete={props.onBulkDelete}
          onCloneRecord={props.onCloneRecord}
          onAddProduct={props.onAddProduct}
          onEditProduct={props.onEditProduct}
          onDeleteProduct={props.onDeleteProduct}
          onToggleProductActive={props.onToggleProductActive}
        />
      )}

      {/* 10. CUSTOMERS & VISITS */}
      {activeTab === 'customers' && (
        <CustomersModule
          customers={props.customers}
          visits={props.customerVisits}
          auditLogs={props.customerAuditLogs}
          onUpdateCustomers={props.onUpdateCustomers}
          onUpdateVisits={props.onUpdateVisits}
        />
      )}

      {/* 11. DOCTORS & MEDICAL VISITS */}
      {activeTab === 'doctors' && (
        <DoctorsModule
          doctors={props.doctors}
          visits={props.doctorVisits}
          auditLogs={props.doctorAuditLogs}
          onUpdateDoctors={props.onUpdateDoctors}
          onUpdateVisits={props.onUpdateDoctorVisits}
          onAddAuditLog={props.logDoctorAudit}
        />
      )}

      {/* 12. UNIFIED SETTINGS & BACKUP */}
      {activeTab === 'settings' && (
        <UnifiedSettings
          onExportBackup={props.onExportBackup}
          onImportBackup={props.onImportBackup}
          onResetAllData={props.onResetAllData}
          stockCount={props.products.length}
          movementCount={props.records.length}
          financialCount={props.financialTransactions.length}
          debtsCount={props.debtsCount}
          debtCommitmentsCount={props.debtCommitmentsCount}
          tasksCount={props.tasks.length}
          commitmentsCount={props.commitments.length}
          customersCount={props.customers.length}
          visitsCount={props.customerVisits.length}
          doctorsCount={props.doctors.length}
          doctorVisitsCount={props.doctorVisits.length}
          routinesCount={props.routinesCount}
          custodyCount={loadCustodyIssues().length}
          linksCount={loadLinksRecords().length}
        />
      )}
    </React.Suspense>
  );
};
