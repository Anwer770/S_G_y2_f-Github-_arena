import React from 'react';
import { WorkTask, WorkProject, TeamMember } from '../../types/workos';
import {
  BarChart3,
  TrendingUp,
  Download,
  Clock,
  CheckCircle2,
  AlertTriangle,
  FileSpreadsheet,
  Printer,
} from 'lucide-react';

interface WorkOSReportsViewProps {
  tasks: WorkTask[];
  projects: WorkProject[];
  team: TeamMember[];
  onExportJSON: () => void;
  onExportCSV: () => void;
  onOpenPrintReport?: () => void;
}

export const WorkOSReportsView: React.FC<WorkOSReportsViewProps> = ({
  tasks = [],
  projects = [],
  team = [],
  onExportJSON,
  onExportCSV,
  onOpenPrintReport,
}) => {
  const completedTasks = (tasks || []).filter((t) => t && t.status === 'completed');
  const overdueTasks = (tasks || []).filter(
    (t) => t && t.status !== 'completed' && t.dueDate < new Date().toISOString().split('T')[0]
  );
  const totalEstimatedHours = (tasks || []).reduce((acc, t) => acc + (t?.estimatedHours || 0), 0);
  const totalActualHours = (tasks || []).reduce((acc, t) => acc + (t?.actualHours || 0), 0);

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-700/80 shadow-2xs p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">التقارير والتحليلات المؤسسية المتقدمة</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">مؤشرات الإنتاجية، تتبع الوقت الفعلي، وتصدير البيانات الكاملة</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onOpenPrintReport && (
            <button
              onClick={onOpenPrintReport}
              className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shadow-xs"
            >
              <Printer className="w-3.5 h-3.5 text-teal-400" />
              <span>طباعة تقرير رسمي</span>
            </button>
          )}
          <button
            onClick={onExportCSV}
            className="px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 text-emerald-800 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-300" />
            <span>تصدير Excel / CSV</span>
          </button>
          <button
            onClick={onExportJSON}
            className="px-3 py-1.5 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>نسخة احتياطية JSON</span>
          </button>
        </div>
      </div>

      {/* Metrics Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xs">
          <div className="text-slate-500 dark:text-slate-400 text-xs font-bold mb-1">المهام المكتملة</div>
          <div className="text-2xl font-black text-emerald-700 dark:text-emerald-300 font-mono">
            {completedTasks.length} / {tasks.length}
          </div>
          <div className="text-xs text-slate-400 dark:text-slate-500 mt-1">
            نسبة الإنجاز: {tasks.length > 0 ? Math.round((completedTasks.length / tasks.length) * 100) : 0}%
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xs">
          <div className="text-slate-500 dark:text-slate-400 text-xs font-bold mb-1">المهام المتأخرة</div>
          <div className="text-2xl font-black text-rose-700 dark:text-rose-300 font-mono">{overdueTasks.length}</div>
          <div className="text-xs text-rose-500 font-bold mt-1">تحتاج جدول زمني بديل</div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xs">
          <div className="text-slate-500 dark:text-slate-400 text-xs font-bold mb-1">ساعات العمل المقدرة</div>
          <div className="text-2xl font-black text-slate-800 dark:text-slate-200 font-mono">{totalEstimatedHours} س</div>
          <div className="text-xs text-slate-400 dark:text-slate-500 mt-1">وفق الخطط التشغيلية</div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xs">
          <div className="text-slate-500 dark:text-slate-400 text-xs font-bold mb-1">ساعات العمل الفعلية</div>
          <div className="text-2xl font-black text-teal-700 dark:text-teal-300 font-mono">{totalActualHours} س</div>
          <div className="text-xs text-teal-600 dark:text-teal-400 font-bold mt-1">المسجلة في مؤقت النظام</div>
        </div>
      </div>

      {/* Team Productivity Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-700/80 shadow-2xs p-5 space-y-3">
        <h3 className="font-bold text-xs text-slate-800 dark:text-slate-200">مؤشرات أداء أعضاء الفريق والمسؤولين</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse text-xs min-w-[600px] print:min-w-0">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-700">
                <th className="py-2.5 px-3">الموظف</th>
                <th className="py-2.5 px-3">القسم</th>
                <th className="py-2.5 px-3 text-center">المهام الكلية</th>
                <th className="py-2.5 px-3 text-center">المنجزة</th>
                <th className="py-2.5 px-3 text-center">المتأخرة</th>
                <th className="py-2.5 px-3 text-center">نسبة الإنجاز</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {team.map((m) => {
                const mTasks = tasks.filter((t) => t.assigneeId === m.id);
                const mDone = mTasks.filter((t) => t.status === 'completed');
                const mOverdue = mTasks.filter(
                  (t) => t.status !== 'completed' && t.dueDate < new Date().toISOString().split('T')[0]
                );
                const rate = mTasks.length > 0 ? Math.round((mDone.length / mTasks.length) * 100) : 0;
                return (
                  <tr key={m.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/60">
                    <td className="py-2 px-3 font-bold text-slate-900 dark:text-slate-100">{m.name}</td>
                    <td className="py-2 px-3 text-slate-500 dark:text-slate-400">{m.department}</td>
                    <td className="py-2 px-3 text-center font-mono">{mTasks.length}</td>
                    <td className="py-2 px-3 text-center font-mono text-emerald-700 dark:text-emerald-300 font-bold">{mDone.length}</td>
                    <td className="py-2 px-3 text-center font-mono text-rose-700 dark:text-rose-300 font-bold">{mOverdue.length}</td>
                    <td className="py-2 px-3 text-center">
                      <span className="px-2 py-0.5 rounded-full font-mono font-bold bg-teal-50 dark:bg-teal-950/40 text-teal-800 dark:text-teal-200 border border-teal-200 dark:border-teal-800 text-xs">
                        {rate}%
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
