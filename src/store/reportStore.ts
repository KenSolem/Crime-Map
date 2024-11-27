import { create } from 'zustand';
import { Report } from '../types';

interface ReportState {
  reports: Report[];
  setReports: (reports: Report[]) => void;
  addReport: (report: Report) => void;
  closeReport: (reportId: string, closureReport: string) => void;
}

export const useReportStore = create<ReportState>((set) => ({
  reports: [],
  setReports: (reports) => set({ reports }),
  addReport: (report) =>
    set((state) => ({ reports: [...state.reports, report] })),
  closeReport: (reportId, closureReport) =>
    set((state) => ({
      reports: state.reports.map((report) =>
        report.id === reportId
          ? {
              ...report,
              status: 'CLOSED',
              closureReport,
              closedAt: new Date(),
            }
          : report
      ),
    })),
}));