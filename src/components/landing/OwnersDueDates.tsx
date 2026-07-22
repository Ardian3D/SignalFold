import React from 'react';

export const OwnersDueDates: React.FC = () => {
  const rows = [
    {
      action: 'A-01',
      proposedOwner: 'PAYMENTS API SERVICE OWNER',
      ownerType: 'ROLE PROPOSAL',
      dueDate: 'NOT ASSIGNED',
      status: 'OWNER CONFIRMATION REQUIRED'
    },
    {
      action: 'A-02',
      proposedOwner: 'ENGINEERING LEAD',
      ownerType: 'ROLE PROPOSAL',
      dueDate: 'NOT ASSIGNED',
      status: 'OWNER CONFIRMATION REQUIRED'
    },
    {
      action: 'A-03',
      proposedOwner: 'INCIDENT MANAGER + BUSINESS OPERATIONS',
      ownerType: 'SHARED ROLE PROPOSAL',
      dueDate: 'NOT ASSIGNED',
      status: 'OWNER CONFIRMATION REQUIRED'
    },
    {
      action: 'A-04',
      proposedOwner: 'INCIDENT MANAGER',
      ownerType: 'ROLE PROPOSAL',
      dueDate: 'NOT ASSIGNED',
      status: 'OWNER CONFIRMATION REQUIRED'
    }
  ];

  return (
    <div className="space-y-5 pb-6">
      {/* Header / Section Label & Status */}
      <div
        className="flex flex-wrap items-center justify-between gap-2 text-[10px] sm:text-[11px] font-mono font-bold tracking-widest uppercase"
        style={{ fontFamily: 'var(--font-technical)' }}
      >
        <span className="text-[#0A0A0A]">
          11 / OWNERS & DUE DATES
        </span>

        <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[2px] bg-[#1C1A14] border border-[#383322] text-[#EAB308] text-[10px] font-bold">
          <span
            aria-hidden="true"
            className="w-1.5 h-1.5 rounded-full bg-[#EAB308]"
          />
          ASSIGNMENT REQUIRED BEFORE APPROVAL
        </div>
      </div>

      {/* Introductory copy */}
      <p
        className="text-sm sm:text-base text-[#2A2B28] leading-relaxed max-w-none"
        style={{ fontFamily: 'var(--font-ui)' }}
      >
        Follow-up ownership and due dates have not yet been approved. The roles below are proposed coordination owners and must be confirmed by an authorized human during Postmortem review.
      </p>

      {/* Table Structure */}
      <div className="w-full border border-[#D8D4C8] overflow-hidden">
        {/* Desktop Table: Hidden on smaller screens, shown on xl: and larger */}
        <table className="hidden xl:table w-full border-collapse text-[11px] font-mono">
          <thead>
            <tr className="bg-[#EFECE2] border-b border-[#D8D4C8] text-left">
              <th className="px-3 py-2.5 font-bold text-[#7A7C74] border-r border-[#D8D4C8] w-16 select-none">
                ACTION
              </th>
              <th className="px-3 py-2.5 font-bold text-[#7A7C74] border-r border-[#D8D4C8] select-none">
                PROPOSED OWNER
              </th>
              <th className="px-3 py-2.5 font-bold text-[#7A7C74] border-r border-[#D8D4C8] w-48 select-none">
                OWNER TYPE
              </th>
              <th className="px-3 py-2.5 font-bold text-[#7A7C74] border-r border-[#D8D4C8] w-36 select-none">
                DUE DATE
              </th>
              <th className="px-3 py-2.5 font-bold text-[#7A7C74] select-none">
                STATUS
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#D8D4C8]">
            {rows.map((row) => (
              <tr key={row.action} className="hover:bg-[#F5F2E9] transition-colors">
                <td className="px-3 py-3 text-[#0A0A0A] font-bold border-r border-[#D8D4C8] whitespace-nowrap">
                  {row.action}
                </td>
                <td className="px-3 py-3 text-[#0A0A0A] border-r border-[#D8D4C8]">
                  {row.proposedOwner}
                </td>
                <td className="px-3 py-3 text-[#0A0A0A] border-r border-[#D8D4C8]">
                  {row.ownerType}
                </td>
                <td className="px-3 py-3 text-[#0A0A0A] border-r border-[#D8D4C8] whitespace-nowrap">
                  {row.dueDate}
                </td>
                <td className="px-3 py-3 text-[#EAB308] font-bold">
                  {row.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Mobile / Tablet View: Stacked display for narrow/medium viewports */}
        <div className="xl:hidden divide-y divide-[#D8D4C8] text-[11px] font-mono">
          {rows.map((row) => (
            <div key={row.action} className="p-4 space-y-2.5 bg-[#FAF9F5]">
              <div className="flex items-center justify-between border-b border-[#D8D4C8] pb-1.5">
                <span className="text-[#7A7C74] font-bold">ACTION</span>
                <span className="text-[#0A0A0A] font-bold">{row.action}</span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-[#7A7C74]">PROPOSED OWNER</span>
                <span className="text-[#0A0A0A] font-bold">{row.proposedOwner}</span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-[#7A7C74]">OWNER TYPE</span>
                <span className="text-[#0A0A0A] font-medium">{row.ownerType}</span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-[#7A7C74]">DUE DATE</span>
                <span className="text-[#0A0A0A]">{row.dueDate}</span>
              </div>
              <div className="flex flex-col gap-0.5 border-t border-[#D8D4C8] pt-1.5">
                <span className="text-[#7A7C74]">STATUS</span>
                <span className="text-[#EAB308] font-bold">{row.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Closing Note */}
      <p
        className="text-xs text-[#5A5C56] italic"
        style={{ fontFamily: 'var(--font-ui)' }}
      >
        Preventive actions must not be marked approved until every item has a confirmed owner, due date, and acceptance evidence.
      </p>
    </div>
  );
};
