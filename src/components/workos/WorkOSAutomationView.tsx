import React from 'react';
import { AutomationRule } from '../../types/workos';
import { Cpu, Zap, CheckCircle2, Play, ToggleLeft, ToggleRight, Clock } from 'lucide-react';

interface WorkOSAutomationViewProps {
  automations: AutomationRule[];
  onToggleAutomation: (id: string) => void;
  onExecuteAutomationManually: (rule: AutomationRule) => void;
}

export const WorkOSAutomationView: React.FC<WorkOSAutomationViewProps> = ({
  automations,
  onToggleAutomation,
  onExecuteAutomationManually,
}) => {
  return (
    <div className="space-y-6" dir="rtl">
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-700/80 shadow-2xs p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">محرك الأتمتة وقواعد سير العمل (Automation Engine)</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">تنفيذ الإجراءات التلقائية عند تغير حالات المهام والمشاريع والمواعيد</p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {automations.map((rule) => {
          return (
            <div
              key={rule.id}
              className={`bg-white dark:bg-slate-900 rounded-xl border p-5 shadow-2xs transition flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                rule.isActive ? 'border-slate-200' : 'border-slate-100 opacity-60 bg-slate-50'
              }`}
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-200">
                    <Zap className="w-4 h-4" />
                  </span>
                  <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">{rule.name}</h3>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">{rule.description}</p>
                <div className="flex items-center gap-3 text-xs text-slate-400 dark:text-slate-500 pt-1">
                  <span>تم التنفيذ تلقائياً: <strong className="font-mono text-slate-700 dark:text-slate-200">{rule.executionsCount} مرة</strong></span>
                  {rule.lastExecutedAt && (
                    <>
                      <span>•</span>
                      <span>آخر تنفيذ: <strong className="font-mono">{rule.lastExecutedAt.split('T')[0]}</strong></span>
                    </>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 self-end md:self-auto">
                <button
                  onClick={() => onExecuteAutomationManually(rule)}
                  className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 text-teal-700 dark:text-teal-300" />
                  <span>تشغيل تجريبي</span>
                </button>

                <button
                  onClick={() => onToggleAutomation(rule.id)}
                  className="cursor-pointer"
                  title={rule.isActive ? 'تعطيل القاعدة' : 'تفعيل القاعدة'}
                >
                  {rule.isActive ? (
                    <ToggleRight className="w-8 h-8 text-teal-600 dark:text-teal-400" />
                  ) : (
                    <ToggleLeft className="w-8 h-8 text-slate-300" />
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
