import React, { useState, useMemo } from 'react';
import { CalendarViewMode, Task } from '../../types';
import { downloadICS } from '../../utils/tasks';
import { calculateArabicDay } from '../../utils/formatters';
import {
  Calendar as CalendarIcon,
  ChevronRight,
  ChevronLeft,
  Download,
  CheckCircle2,
  Clock,
  User,
  Tag,
  Check,
} from 'lucide-react';

interface Props {
  tasks: Task[];
  onToggleComplete: (task: Task) => void;
  onEditTask: (task: Task) => void;
}

const ARABIC_WEEKDAYS = [
  { name: 'السبت', index: 6 },
  { name: 'الأحد', index: 0 },
  { name: 'الإثنين', index: 1 },
  { name: 'الثلاثاء', index: 2 },
  { name: 'الأربعاء', index: 3 },
  { name: 'الخميس', index: 4 },
  { name: 'الجمعة', index: 5 },
];

export const CalendarView: React.FC<Props> = ({ tasks, onToggleComplete, onEditTask }) => {
  const [viewMode, setViewMode] = useState<CalendarViewMode>('monthly');
  const [currentDate, setCurrentDate] = useState(new Date(2024, 9, 15)); // Oct 2024 active

  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);
  const selectedDateStr = useMemo(() => currentDate.toISOString().split('T')[0], [currentDate]);

  // Navigate functions
  const handlePrev = () => {
    const next = new Date(currentDate);
    if (viewMode === 'daily') next.setDate(next.getDate() - 1);
    else if (viewMode === 'weekly') next.setDate(next.getDate() - 7);
    else next.setMonth(next.getMonth() - 1);
    setCurrentDate(next);
  };

  const handleNext = () => {
    const next = new Date(currentDate);
    if (viewMode === 'daily') next.setDate(next.getDate() + 1);
    else if (viewMode === 'weekly') next.setDate(next.getDate() + 7);
    else next.setMonth(next.getMonth() + 1);
    setCurrentDate(next);
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  // Helper for priority badge styling
  const getPriorityStyle = (pri: string) => {
    if (pri === 'A') return 'bg-rose-50 text-rose-700 border-rose-200';
    if (pri === 'B') return 'bg-amber-50 text-amber-700 border-amber-200';
    if (pri === 'C') return 'bg-blue-50 text-blue-700 border-blue-200';
    return 'bg-slate-50 text-slate-700 border-slate-200';
  };

  // Helper for status badge styling
  const getStatusColor = (status: string) => {
    if (status === 'تم الانجاز') return 'text-emerald-700 bg-emerald-50 border-emerald-200';
    if (status === 'متأخر') return 'text-rose-700 bg-rose-50 border-rose-200';
    if (status === 'قيد التنفيذ') return 'text-indigo-700 bg-indigo-50 border-indigo-200';
    return 'text-slate-700 bg-slate-50 border-slate-200';
  };

  // Calculate Days in Month for Monthly View
  const monthDays = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    // Arabic week starts Saturday (index 6). Sunday is 0 -> mapped offset: (day + 1) % 7
    const firstDayIndex = (firstDay.getDay() + 1) % 7;
    const totalDays = lastDay.getDate();

    const days: { dateStr: string; dayNum: number; isCurrentMonth: boolean }[] = [];

    // Prev month padding
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const d = prevMonthLastDay - i;
      const prevDate = new Date(year, month - 1, d);
      days.push({
        dateStr: prevDate.toISOString().split('T')[0],
        dayNum: d,
        isCurrentMonth: false,
      });
    }

    // Current month days
    for (let i = 1; i <= totalDays; i++) {
      const curr = new Date(year, month, i);
      days.push({
        dateStr: curr.toISOString().split('T')[0],
        dayNum: i,
        isCurrentMonth: true,
      });
    }

    // Next month padding to fill complete 35 or 42 grid
    const remaining = (7 - (days.length % 7)) % 7;
    for (let i = 1; i <= remaining; i++) {
      const nextDate = new Date(year, month + 1, i);
      days.push({
        dateStr: nextDate.toISOString().split('T')[0],
        dayNum: i,
        isCurrentMonth: false,
      });
    }

    return days;
  }, [currentDate]);

  // Calculate Week Days for Weekly View (Saturday to Friday)
  const weekDays = useMemo(() => {
    const cur = new Date(currentDate);
    const day = cur.getDay(); // 0: Sun, 6: Sat
    const diffToSat = (day + 1) % 7;

    const sat = new Date(cur);
    sat.setDate(cur.getDate() - diffToSat);

    const days: { dateStr: string; dayName: string; dayNum: number }[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(sat);
      d.setDate(sat.getDate() + i);
      const str = d.toISOString().split('T')[0];
      days.push({
        dateStr: str,
        dayName: ARABIC_WEEKDAYS[i].name,
        dayNum: d.getDate(),
      });
    }
    return days;
  }, [currentDate]);

  // Filter tasks for given date
  const getTasksForDate = (dateStr: string) => {
    return tasks.filter((t) => {
      const tEnd = t.end || t.start;
      return t.start <= dateStr && tEnd >= dateStr;
    });
  };

  return (
    <div className="space-y-4">
      {/* Calendar Header Control Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Navigation & Title */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-1.5">
            <button
              onClick={handlePrev}
              className="p-2 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors"
              title="السابق"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={handleNext}
              className="p-2 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors"
              title="التالي"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleToday}
              className="px-3 py-1.5 text-xs font-bold border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors text-slate-700 dark:text-slate-200"
            >
              اليوم
            </button>
          </div>

          <h3 className="font-black text-slate-900 dark:text-slate-100 text-base md:text-lg">
            {currentDate.toLocaleDateString('ar-YE', {
              year: 'numeric',
              month: 'long',
              ...(viewMode === 'daily' ? { day: 'numeric', weekday: 'long' } : {}),
            })}
          </h3>
        </div>

        {/* View Mode Switcher & ICS Export */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setViewMode('daily')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'daily' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              يومي
            </button>
            <button
              onClick={() => setViewMode('weekly')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'weekly' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              أسبوعي
            </button>
            <button
              onClick={() => setViewMode('monthly')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'monthly' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              شهري
            </button>
          </div>

          <button
            id="download-ics-calendar-btn"
            onClick={() => downloadICS(tasks)}
            className="flex items-center gap-1.5 px-3 py-2 bg-indigo-50 dark:bg-indigo-950/40 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 rounded-xl text-xs font-bold transition-colors"
            title="تصدير ملف التقويم ICS لمزامنة Google Calendar / Outlook"
          >
            <Download className="w-3.5 h-3.5" />
            <span>مزامنة ICS</span>
          </button>
        </div>
      </div>

      {/* 1. MONTHLY VIEW */}
      {viewMode === 'monthly' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs overflow-hidden">
          {/* Weekday Headers */}
          <div className="grid grid-cols-7 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-center py-2.5 text-xs font-bold text-slate-600 dark:text-slate-300">
            {ARABIC_WEEKDAYS.map((w) => (
              <div key={w.name}>{w.name}</div>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 divide-x divide-y divide-slate-100 dark:divide-slate-800">
            {monthDays.map((d, idx) => {
              const dayTasks = getTasksForDate(d.dateStr);
              const isToday = d.dateStr === todayStr;

              return (
                <div
                  key={idx}
                  onClick={() => {
                    setCurrentDate(new Date(d.dateStr));
                    setViewMode('daily');
                  }}
                  className={`min-h-[105px] p-1.5 cursor-pointer transition-colors hover:bg-indigo-50/30 dark:hover:bg-indigo-950/40 ${
                    !d.isCurrentMonth ? 'bg-slate-50/50 text-slate-300' : 'bg-white text-slate-800'
                  } ${isToday ? 'bg-amber-50/40 ring-2 ring-inset ring-amber-400' : ''}`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span
                      className={`text-xs font-bold px-1.5 py-0.5 rounded-full ${
                        isToday
                          ? 'bg-amber-500 text-white font-black'
                          : d.isCurrentMonth
                          ? 'text-slate-700'
                          : 'text-slate-400'
                      }`}
                    >
                      {d.dayNum}
                    </span>
                    {dayTasks.length > 0 && (
                      <span className="text-xs font-mono font-bold text-slate-400 dark:text-slate-500">
                        {dayTasks.length}
                      </span>
                    )}
                  </div>

                  {/* Task Chips */}
                  <div className="space-y-1 overflow-y-auto max-h-[70px]">
                    {dayTasks.slice(0, 3).map((t) => (
                      <div
                        key={t.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          onEditTask(t);
                        }}
                        className={`text-xs p-1 rounded-md border truncate font-medium flex items-center justify-between ${
                          t.status === 'تم الانجاز'
                            ? 'bg-slate-100 text-slate-400 line-through border-slate-200'
                            : t.pri === 'A'
                            ? 'bg-rose-50 text-rose-800 border-rose-200'
                            : 'bg-indigo-50 text-indigo-800 border-indigo-200'
                        }`}
                        title={t.title}
                      >
                        <span className="truncate">{t.title}</span>
                      </div>
                    ))}
                    {dayTasks.length > 3 && (
                      <div className="text-xs text-slate-400 dark:text-slate-500 text-center font-bold">
                        +{dayTasks.length - 3} مهام أخرى
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. WEEKLY VIEW (SATURDAY TO FRIDAY) */}
      {viewMode === 'weekly' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-7 divide-y md:divide-y-0 md:divide-x divide-slate-200 dark:divide-slate-700">
            {weekDays.map((w) => {
              const dayTasks = getTasksForDate(w.dateStr);
              const isToday = w.dateStr === todayStr;

              return (
                <div key={w.dateStr} className={`p-3 min-h-[300px] flex flex-col ${isToday ? 'bg-amber-50/30' : 'bg-white'}`}>
                  <div className="border-b border-slate-100 dark:border-slate-800 pb-2 mb-2 flex items-center justify-between">
                    <div>
                      <span className="block text-xs font-bold text-slate-500 dark:text-slate-400">{w.dayName}</span>
                      <span className={`text-base font-black ${isToday ? 'text-amber-600' : 'text-slate-900'}`}>
                        {w.dayNum}
                      </span>
                    </div>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-mono font-bold">
                      {dayTasks.length}
                    </span>
                  </div>

                  {/* Tasks List */}
                  <div className="space-y-2 flex-1 overflow-y-auto">
                    {dayTasks.length === 0 ? (
                      <p className="text-xs text-slate-300 text-center py-8">لا توجد مهام</p>
                    ) : (
                      dayTasks.map((t) => (
                        <div
                          key={t.id}
                          className={`p-2.5 rounded-xl border text-xs space-y-1.5 transition-all hover:shadow-xs cursor-pointer ${
                            t.status === 'تم الانجاز'
                              ? 'bg-slate-50 border-slate-200 text-slate-400 opacity-75'
                              : 'bg-white border-slate-200 hover:border-indigo-300'
                          }`}
                          onClick={() => onEditTask(t)}
                        >
                          <div className="flex items-start justify-between gap-1">
                            <span className="font-bold text-slate-800 dark:text-slate-200 line-clamp-2">{t.title}</span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onToggleComplete(t);
                              }}
                              className={`p-1 rounded-md shrink-0 ${
                                t.status === 'تم الانجاز'
                                  ? 'bg-emerald-600 text-white'
                                  : 'border border-slate-300 text-slate-400 hover:border-emerald-500 hover:text-emerald-500'
                              }`}
                            >
                              <Check className="w-3 h-3" />
                            </button>
                          </div>

                          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-1 border-t border-slate-100 dark:border-slate-800">
                            <span>{t.cat}</span>
                            <span className="font-bold text-slate-700 dark:text-slate-200">{t.resp}</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. DAILY VIEW */}
      {viewMode === 'daily' && (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-700">
            <div>
              <h4 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                مهام يوم {calculateArabicDay(selectedDateStr)} ({selectedDateStr})
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                قائمة ومتابعة كافة المهام والزيارات المجدولة في هذا اليوم
              </p>
            </div>
            <span className="px-3 py-1 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 font-bold rounded-lg text-sm">
              {getTasksForDate(selectedDateStr).length} مهمة
            </span>
          </div>

          <div className="space-y-3">
            {getTasksForDate(selectedDateStr).length === 0 ? (
              <div className="py-16 text-center text-slate-400 dark:text-slate-500 space-y-2">
                <CalendarIcon className="w-10 h-10 mx-auto text-slate-300" />
                <p>لا توجد مهام مجدولة في هذا اليوم المحدد.</p>
              </div>
            ) : (
              getTasksForDate(selectedDateStr).map((t) => (
                <div
                  key={t.id}
                  className={`p-4 rounded-xl border flex flex-col md:flex-row items-start md:items-center justify-between gap-3 transition-all ${
                    t.status === 'تم الانجاز'
                      ? 'bg-slate-50 border-slate-200 text-slate-500'
                      : 'bg-white border-slate-200 hover:shadow-xs'
                  }`}
                >
                  <div className="flex items-start gap-3 flex-1">
                    <button
                      onClick={() => onToggleComplete(t)}
                      className={`mt-0.5 p-1.5 rounded-lg shrink-0 transition-colors ${
                        t.status === 'تم الانجاز'
                          ? 'bg-emerald-600 text-white'
                          : 'border-2 border-slate-300 text-transparent hover:border-emerald-500 hover:text-emerald-500'
                      }`}
                    >
                      <Check className="w-4 h-4" />
                    </button>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 px-2 py-0.5 rounded">
                          {t.id}
                        </span>
                        <h5
                          className={`font-bold text-sm text-slate-900 dark:text-slate-100 ${
                            t.status === 'تم الانجاز' ? 'line-through text-slate-400' : ''
                          }`}
                        >
                          {t.title}
                        </h5>
                        <span className={`text-xs px-2 py-0.5 rounded border font-bold ${getPriorityStyle(t.pri)}`}>
                          أولوية {t.pri}
                        </span>
                      </div>

                      {t.desc && <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">{t.desc}</p>}

                      <div className="flex items-center flex-wrap gap-4 text-xs text-slate-500 dark:text-slate-400 mt-2">
                        <span>الفئة: <strong>{t.cat}</strong></span>
                        <span>العملية: <strong>{t.op}</strong></span>
                        <span>المسؤول: <strong>{t.resp}</strong></span>
                        {t.amount && <span>المبلغ: <strong className="text-emerald-700 dark:text-emerald-300">{t.amount} ريال</strong></span>}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end md:self-center">
                    <span className={`text-xs font-bold px-3 py-1 rounded-full border ${getStatusColor(t.status)}`}>
                      {t.status}
                    </span>
                    <button
                      onClick={() => onEditTask(t)}
                      className="px-3 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-medium rounded-lg transition-colors"
                    >
                      تعديل
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
