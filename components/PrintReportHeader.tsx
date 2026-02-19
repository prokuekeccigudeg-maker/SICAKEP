
import React from 'react';
import { Institution } from '../types';

interface PrintReportHeaderProps {
  institution: Institution;
  title: string;
}

const PrintReportHeader: React.FC<PrintReportHeaderProps> = ({ institution, title }) => {
  return (
    <div className="print-report-header text-center mb-8">
      <div className="flex items-center justify-center gap-6 mb-4">
        <img src={institution.logo} className="w-20 h-20 object-contain" alt="Logo" />
        <div className="text-center">
          <h1 className="text-2xl font-bold uppercase tracking-widest">{institution.name.toUpperCase()}</h1>
          <p className="text-sm font-medium">{institution.address}</p>
          <p className="text-xs italic">Email: info@cigudeg.bogorkab.go.id | Website: cigudeg.bogorkab.go.id</p>
        </div>
      </div>
      <div className="h-1 bg-black w-full mb-1"></div>
      <div className="h-0.5 bg-black w-full mb-6"></div>
      <h2 className="text-xl font-bold underline decoration-2 underline-offset-4">{title}</h2>
      <p className="text-sm mt-2">Periode: {new Date().toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}</p>
    </div>
  );
};

export default PrintReportHeader;
