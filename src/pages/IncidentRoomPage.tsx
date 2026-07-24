import React, { useState } from 'react';
import { 
  AlertTriangle, 
  Clock, 
  User, 
  Server, 
  ShieldAlert, 
  ListTodo, 
  Database, 
  Network, 
  Activity, 
  HelpCircle,
  FileText,
  Lock,
  Radio,
  Sliders,
  ChevronRight,
  Sparkles,
  Check,
  X
} from 'lucide-react';

type MobileTab = 'TIMELINE' | 'TASKS' | 'DETAILS';

export interface TaskLifecycleState {
  status: 'TODO' | 'IN PROGRESS' | 'BLOCKED' | 'DONE';
  ownership: string;
  claimState: string;
  blockingState: string;
  blockingReason?: string;
  previousBlockingReason?: string;
  completionState: string;
  completionNote?: string;
}

export function IncidentRoomPage() {
  const [activeTab, setActiveTab] = useState<MobileTab>('TIMELINE');

  // Drawer state
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<{
    sequence: string;
    title: string;
    description: string;
    source: string;
    suggestionState: string;
    taskRecord: string;
    ownership: string;
    status: string;
  } | null>(null);

  const [drawerTitle, setDrawerTitle] = useState('');
  const [drawerDescription, setDrawerDescription] = useState('');
  const [drawerPriority, setDrawerPriority] = useState('');
  const [drawerDueTime, setDrawerDueTime] = useState('');
  const [validationError, setValidationError] = useState<{
    title?: string;
    description?: string;
    priority?: string;
  } | null>(null);
  const [isValidatedLocally, setIsValidatedLocally] = useState(false);
  const [activeTriggerId, setActiveTriggerId] = useState<string | null>(null);

  // Local previews state (Phase 03)
  const [localPreviews, setLocalPreviews] = useState<{
    sequence: string;
    title: string;
    description: string;
    priority: string;
    dueTime: string;
  }[]>([]);

  // Task lifecycle state (Phase 04)
  const [lifecycleStates, setLifecycleStates] = useState<Record<string, TaskLifecycleState>>({});
  const [isLifecycleDrawerOpen, setIsLifecycleDrawerOpen] = useState(false);
  const [selectedLifecyclePreview, setSelectedLifecyclePreview] = useState<{
    sequence: string;
    title: string;
    description: string;
    priority: string;
    dueTime: string;
  } | null>(null);

  const [activeLifecycleTriggerId, setActiveLifecycleTriggerId] = useState<string | null>(null);

  // Responder context drawer state
  const [isContextDrawerOpen, setIsContextDrawerOpen] = useState(false);
  const [contextTriggerId, setContextTriggerId] = useState<string | null>(null);

  // Lifecycle drawer forms state
  const [isBlockingFormOpen, setIsBlockingFormOpen] = useState(false);
  const [blockingReasonInput, setBlockingReasonInput] = useState('');
  const [blockingReasonError, setBlockingReasonError] = useState<string | null>(null);

  const [isCompletionFormOpen, setIsCompletionFormOpen] = useState(false);
  const [completionNoteInput, setCompletionNoteInput] = useState('');
  const [isCriticalConfirmed, setIsCriticalConfirmed] = useState(false);
  const [completionError, setCompletionError] = useState<string | null>(null);

  const getLifecycleState = (sequence: string): TaskLifecycleState => {
    return lifecycleStates[sequence] || {
      status: 'TODO',
      ownership: 'UNASSIGNED',
      claimState: 'NOT CLAIMED',
      blockingState: 'NOT BLOCKED',
      completionState: 'NOT COMPLETED',
    };
  };

  const [ariaLiveAnnouncement, setAriaLiveAnnouncement] = useState<{
    title: string;
    desc: string;
  } | null>(null);

  // Task Workspace Drawer states & refs (Phase 03 layout refactor)
  const [isWorkspaceDrawerOpen, setIsWorkspaceDrawerOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [workspaceTriggerId, setWorkspaceTriggerId] = useState<string | null>(null);

  const workspaceDrawerRef = React.useRef<HTMLDivElement>(null);

  const openWorkspaceDrawer = () => {
    setIsWorkspaceDrawerOpen(true);
    setWorkspaceTriggerId('open-task-workspace');
  };

  const closeWorkspaceDrawer = () => {
    setIsWorkspaceDrawerOpen(false);
    if (workspaceTriggerId) {
      setTimeout(() => {
        const trigger = document.getElementById(workspaceTriggerId);
        if (trigger) {
          trigger.focus();
        }
      }, 50);
    }
  };

  React.useEffect(() => {
    const isTestEnv = (typeof process !== 'undefined' && process.env.NODE_ENV === 'test') ||
                      (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.MODE === 'test');
    const handleResize = () => {
      if (isTestEnv) {
        setIsDesktop(false);
      } else {
        setIsDesktop(window.innerWidth >= 1000);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Keyboard and focus effect for workspace drawer
  React.useEffect(() => {
    if (!isWorkspaceDrawerOpen || !isDesktop) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeWorkspaceDrawer();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isWorkspaceDrawerOpen, isDesktop, workspaceTriggerId]);

  React.useEffect(() => {
    if (!isWorkspaceDrawerOpen || !isDesktop) return;

    const timer = setTimeout(() => {
      const closeBtn = workspaceDrawerRef.current?.querySelector('button[aria-label="Close task workspace"]') as HTMLElement;
      if (closeBtn) {
        closeBtn.focus();
      }
    }, 50);

    const handleTabTrap = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      if (!workspaceDrawerRef.current) return;

      const focusableSelectors = 'button:not([disabled]), [href], input, select, textarea, [tabindex="0"]';
      const focusableElements = workspaceDrawerRef.current.querySelectorAll(focusableSelectors);
      if (focusableElements.length === 0) return;

      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    };

    window.addEventListener('keydown', handleTabTrap);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('keydown', handleTabTrap);
    };
  }, [isWorkspaceDrawerOpen, isDesktop]);

  const createLocalPreview = () => {
    if (!selectedTask) return;
    if (localPreviews.some(p => p.sequence === selectedTask.sequence)) {
      setIsDrawerOpen(false);
      setAriaLiveAnnouncement({
        title: 'LOCAL PREVIEW EXISTS',
        desc: `A local task preview for suggestion ${selectedTask.sequence} already exists in your local list. Duplicate previews are not permitted.`
      });
      return;
    }
    const newPreview = {
      sequence: selectedTask.sequence,
      title: drawerTitle,
      description: drawerDescription,
      priority: drawerPriority,
      dueTime: drawerDueTime,
    };
    setLocalPreviews(prev => [...prev, newPreview]);
    setIsDrawerOpen(false);
    setAriaLiveAnnouncement({
      title: 'LOCAL TASK PREVIEW CREATED',
      desc: 'A temporary frontend task preview was created for interface verification. No backend record, assignment, audit event, or timestamp exists.'
    });
  };

  const removeLocalPreview = (sequence: string) => {
    setLocalPreviews(prev => prev.filter(p => p.sequence !== sequence));
    setLifecycleStates(prev => {
      const copy = { ...prev };
      delete copy[sequence];
      return copy;
    });
    setAriaLiveAnnouncement({
      title: 'LOCAL TASK PREVIEW REMOVED',
      desc: 'The temporary frontend task preview has been removed from this session.'
    });
  };

  const clearLocalPreviews = () => {
    setLocalPreviews([]);
    setLifecycleStates({});
    setAriaLiveAnnouncement({
      title: 'LOCAL TASK PREVIEW REMOVED',
      desc: 'All temporary frontend task previews have been removed from this session.'
    });
  };

  const hasLocalPreviewForCurrentSelectedTask = selectedTask
    ? localPreviews.some(p => p.sequence === selectedTask.sequence)
    : false;

  const drawerRef = React.useRef<HTMLDivElement>(null);
  const contextDrawerRef = React.useRef<HTMLDivElement>(null);

  const openContextDrawer = () => {
    setIsContextDrawerOpen(true);
    setContextTriggerId('view-responder-context');
  };

  const closeContextDrawer = () => {
    setIsContextDrawerOpen(false);
    if (contextTriggerId) {
      setTimeout(() => {
        const trigger = document.getElementById(contextTriggerId);
        if (trigger) {
          trigger.focus();
        }
      }, 50);
    }
  };

  React.useEffect(() => {
    if (!isContextDrawerOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeContextDrawer();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isContextDrawerOpen, contextTriggerId]);

  React.useEffect(() => {
    if (!isContextDrawerOpen) return;

    const timer = setTimeout(() => {
      const closeBtn = contextDrawerRef.current?.querySelector('button[aria-label="Close responder context"]') as HTMLElement;
      if (closeBtn) {
        closeBtn.focus();
      }
    }, 50);

    const handleTabTrap = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      if (!contextDrawerRef.current) return;

      const focusableSelectors = 'button:not([disabled]), [href], input, select, textarea, [tabindex="0"]';
      const focusableElements = contextDrawerRef.current.querySelectorAll(focusableSelectors);
      if (focusableElements.length === 0) return;

      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    };

    window.addEventListener('keydown', handleTabTrap);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('keydown', handleTabTrap);
    };
  }, [isContextDrawerOpen]);

  React.useEffect(() => {
    if (!isDrawerOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeDrawer();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isDrawerOpen, activeTriggerId]);

  React.useEffect(() => {
    if (!isDrawerOpen) return;

    // Focus the first focusable input or close button when drawer opens
    const timer = setTimeout(() => {
      const closeBtn = drawerRef.current?.querySelector('button[aria-label="Close task review"]') as HTMLElement;
      if (closeBtn) {
        closeBtn.focus();
      }
    }, 50);

    const handleTabTrap = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      if (!drawerRef.current) return;

      const focusableSelectors = 'button:not([disabled]), [href], input, select, textarea, [tabindex="0"]';
      const focusableElements = drawerRef.current.querySelectorAll(focusableSelectors);
      if (focusableElements.length === 0) return;

      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    };

    window.addEventListener('keydown', handleTabTrap);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('keydown', handleTabTrap);
    };
  }, [isDrawerOpen]);

  const openDrawer = (task: typeof suggestedTasks[0]) => {
    setSelectedTask(task);
    setDrawerTitle(task.title);
    setDrawerDescription(task.description);
    setDrawerPriority('');
    setDrawerDueTime('');
    setValidationError(null);
    setIsValidatedLocally(false);
    setIsDrawerOpen(true);
    setActiveTriggerId(`review-task-${task.sequence}`);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
    if (activeTriggerId) {
      setTimeout(() => {
        const trigger = document.getElementById(activeTriggerId);
        if (trigger) {
          trigger.focus();
        }
      }, 50);
    }
  };

  const validateDraft = () => {
    const errors: { title?: string; description?: string; priority?: string } = {};
    
    if (!drawerTitle.trim()) {
      errors.title = 'Task title is required.';
    } else if (drawerTitle.length < 3) {
      errors.title = 'Use at least 3 characters.';
    } else if (drawerTitle.length > 160) {
      errors.title = 'Task title cannot exceed 160 characters.';
    }

    if (drawerDescription.length > 2000) {
      errors.description = 'Task description cannot exceed 2,000 characters.';
    }

    if (!drawerPriority || drawerPriority === 'SELECT_PRIORITY') {
      errors.priority = 'Select a task priority before creation.';
    }

    if (Object.keys(errors).length > 0) {
      setValidationError(errors);
      setIsValidatedLocally(false);
    } else {
      setValidationError(null);
      setIsValidatedLocally(true);
    }
  };

  const handleReset = () => {
    if (selectedTask) {
      setDrawerTitle(selectedTask.title);
      setDrawerDescription(selectedTask.description);
      setDrawerPriority('');
      setDrawerDueTime('');
      setValidationError(null);
      setIsValidatedLocally(false);
    }
  };

  const lifecycleDrawerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!isLifecycleDrawerOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeLifecycleDrawer();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isLifecycleDrawerOpen, activeLifecycleTriggerId]);

  React.useEffect(() => {
    if (!isLifecycleDrawerOpen) return;

    const timer = setTimeout(() => {
      const closeBtn = lifecycleDrawerRef.current?.querySelector('button[aria-label="Close task lifecycle"]') as HTMLElement;
      if (closeBtn) {
        closeBtn.focus();
      }
    }, 50);

    const handleTabTrap = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      if (!lifecycleDrawerRef.current) return;

      const focusableSelectors = 'button:not([disabled]), [href], input, select, textarea, [tabindex="0"]';
      const focusableElements = lifecycleDrawerRef.current.querySelectorAll(focusableSelectors);
      if (focusableElements.length === 0) return;

      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    };

    window.addEventListener('keydown', handleTabTrap);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('keydown', handleTabTrap);
    };
  }, [isLifecycleDrawerOpen]);

  const openLifecycleDrawer = (preview: typeof localPreviews[0]) => {
    setIsDrawerOpen(false); // Close review drawer if open
    setSelectedLifecyclePreview(preview);
    setIsLifecycleDrawerOpen(true);
    setIsBlockingFormOpen(false);
    setIsCompletionFormOpen(false);
    setBlockingReasonInput('');
    setCompletionNoteInput('');
    setIsCriticalConfirmed(false);
    setBlockingReasonError(null);
    setCompletionError(null);
    setActiveLifecycleTriggerId(`lifecycle-task-${preview.sequence}`);
  };

  const closeLifecycleDrawer = () => {
    setIsLifecycleDrawerOpen(false);
    if (activeLifecycleTriggerId) {
      setTimeout(() => {
        const trigger = document.getElementById(activeLifecycleTriggerId);
        if (trigger) {
          trigger.focus();
        }
      }, 50);
    }
  };

  const claimTaskLocally = () => {
    if (!selectedLifecyclePreview) return;
    setLifecycleStates(prev => ({
      ...prev,
      [selectedLifecyclePreview.sequence]: {
        status: 'TODO',
        ownership: 'CURRENT OPERATOR / LOCAL PREVIEW',
        claimState: 'CLAIMED LOCALLY',
        blockingState: 'NOT BLOCKED',
        completionState: 'NOT COMPLETED',
      }
    }));
    setAriaLiveAnnouncement({
      title: 'LOCAL CLAIM PREVIEWED',
      desc: 'The task was claimed locally inside current frontend session. Responders list and Timeline remain unchanged.'
    });
  };

  const startWorkLocally = () => {
    if (!selectedLifecyclePreview) return;
    setLifecycleStates(prev => ({
      ...prev,
      [selectedLifecyclePreview.sequence]: {
        status: 'IN PROGRESS',
        ownership: 'CURRENT OPERATOR / LOCAL PREVIEW',
        claimState: 'CLAIMED LOCALLY',
        blockingState: 'NOT BLOCKED',
        completionState: 'NOT COMPLETED',
      }
    }));
    setAriaLiveAnnouncement({
      title: 'LOCAL WORK STARTED',
      desc: 'The task preview status was updated to In Progress locally.'
    });
  };

  const resetLocalClaim = () => {
    if (!selectedLifecyclePreview) return;
    setLifecycleStates(prev => ({
      ...prev,
      [selectedLifecyclePreview.sequence]: {
        status: 'TODO',
        ownership: 'UNASSIGNED',
        claimState: 'NOT CLAIMED',
        blockingState: 'NOT BLOCKED',
        completionState: 'NOT COMPLETED',
      }
    }));
    setAriaLiveAnnouncement({
      title: 'LOCAL CLAIM RESET',
      desc: 'The local claim was reset. Ownership returned to unassigned.'
    });
  };

  const resetLifecyclePreview = () => {
    if (!selectedLifecyclePreview) return;
    setLifecycleStates(prev => ({
      ...prev,
      [selectedLifecyclePreview.sequence]: {
        status: 'TODO',
        ownership: 'UNASSIGNED',
        claimState: 'NOT CLAIMED',
        blockingState: 'NOT BLOCKED',
        completionState: 'NOT COMPLETED',
      }
    }));
    setIsBlockingFormOpen(false);
    setIsCompletionFormOpen(false);
    setBlockingReasonInput('');
    setCompletionNoteInput('');
    setIsCriticalConfirmed(false);
    setBlockingReasonError(null);
    setCompletionError(null);
    setAriaLiveAnnouncement({
      title: 'LIFECYCLE PREVIEW RESET',
      desc: 'The lifecycle preview was reset back to TODO and unassigned state.'
    });
  };

  const resumeWorkLocally = () => {
    if (!selectedLifecyclePreview) return;
    const current = getLifecycleState(selectedLifecyclePreview.sequence);
    setLifecycleStates(prev => ({
      ...prev,
      [selectedLifecyclePreview.sequence]: {
        ...current,
        status: 'IN PROGRESS',
        blockingState: 'NOT BLOCKED',
        previousBlockingReason: current.blockingReason,
        blockingReason: undefined,
      }
    }));
    setAriaLiveAnnouncement({
      title: 'LOCAL WORK RESUMED',
      desc: 'The task preview status has returned to In Progress.'
    });
  };

  const handleBlockingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLifecyclePreview) return;
    const val = blockingReasonInput.trim();
    if (!val) {
      setBlockingReasonError('Blocking reason is required.');
      return;
    }
    if (val.length < 5) {
      setBlockingReasonError('Use at least 5 characters.');
      return;
    }
    if (blockingReasonInput.length > 500) {
      setBlockingReasonError('Blocking reason cannot exceed 500 characters.');
      return;
    }

    setLifecycleStates(prev => ({
      ...prev,
      [selectedLifecyclePreview.sequence]: {
        status: 'BLOCKED',
        ownership: 'CURRENT OPERATOR / LOCAL PREVIEW',
        claimState: 'CLAIMED LOCALLY',
        blockingState: 'BLOCKED LOCALLY',
        blockingReason: blockingReasonInput,
        completionState: 'NOT COMPLETED',
      }
    }));
    setIsBlockingFormOpen(false);
    setAriaLiveAnnouncement({
      title: 'LOCAL TASK BLOCKED',
      desc: 'The task preview status was updated to Blocked locally. No timeline event was generated.'
    });
  };

  const handleCompletionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLifecyclePreview) return;
    
    if (completionNoteInput.length > 1000) {
      setCompletionError('Completion note cannot exceed 1000 characters.');
      return;
    }

    if (selectedLifecyclePreview.priority === 'CRITICAL' && !isCriticalConfirmed) {
      setCompletionError('Explicit confirmation is required for critical task completion.');
      return;
    }

    setLifecycleStates(prev => ({
      ...prev,
      [selectedLifecyclePreview.sequence]: {
        status: 'DONE',
        ownership: 'CURRENT OPERATOR / LOCAL PREVIEW',
        claimState: 'CLAIMED LOCALLY',
        blockingState: 'NOT BLOCKED',
        completionState: 'COMPLETED LOCALLY',
        completionNote: completionNoteInput,
      }
    }));
    setIsCompletionFormOpen(false);
    setAriaLiveAnnouncement({
      title: 'LOCAL TASK COMPLETED',
      desc: 'The task preview reached the completed state locally. No authoritative record or event was generated.'
    });
  };

  const mockEvents = [
    {
      sequence: '01',
      title: 'INCIDENT REPORTED',
      type: 'INCIDENT_CREATED',
      description: 'Checkout payment failures affecting the Payments API were recorded as incident SF-2026-0042.',
      state: 'REPORTED',
      source: 'CANONICAL INCIDENT RECORD',
      actor: 'NOT AVAILABLE',
      time: 'NOT AVAILABLE',
      persistence: 'NOT CONNECTED',
      stateColor: 'text-amber-500'
    },
    {
      sequence: '02',
      title: 'CUSTOMER SIGNAL RECORDED',
      type: 'INCIDENT_CONTEXT_ADDED',
      description: 'The incident report documents 37 customer reports received within the known 12-minute signal window.',
      state: '37 REPORTS / 12 MINUTES',
      source: 'SUPPORT CONTEXT',
      actor: 'NOT AVAILABLE',
      time: 'NOT AVAILABLE',
      persistence: 'NOT CONNECTED',
      stateColor: 'text-amber-500'
    },
    {
      sequence: '03',
      title: 'AI TRIAGE SUGGESTION PREPARED',
      type: 'AI_TRIAGE_PREVIEW',
      description: 'AI assistance proposed SEV1 severity, review flags, clarifying questions, and an immediate-action suggestion.',
      state: 'HUMAN CONFIRMATION REQUIRED',
      source: 'FRONTEND AI PREVIEW',
      actor: 'AI SERVICE / NOT CONNECTED',
      time: 'NOT AVAILABLE',
      persistence: 'NOT CONNECTED',
      stateColor: 'text-red-500'
    },
    {
      sequence: '04',
      title: 'RESPONSE TASK SET PROPOSED',
      type: 'TASK_RECOMMENDATIONS_PREVIEWED',
      description: 'Five canonical response-task suggestions were prepared for human review.',
      state: '5 RECOMMENDED / NOT ACCEPTED',
      source: 'FRONTEND AI PREVIEW',
      actor: 'AI SERVICE / NOT CONNECTED',
      time: 'NOT AVAILABLE',
      persistence: 'NOT CONNECTED',
      stateColor: 'text-amber-500'
    }
  ];

  const suggestedTasks = [
    {
      sequence: '01',
      title: 'COMPARE LATEST DEPLOYMENT CHANGES',
      description: 'Review the latest Payments API deployment changes and identify relevant code, configuration, or dependency differences.',
      source: 'AI TRIAGE PREVIEW',
      suggestionState: 'NOT ACCEPTED',
      taskRecord: 'NOT CREATED',
      ownership: 'UNASSIGNED',
      status: 'NOT APPLICABLE'
    },
    {
      sequence: '02',
      title: 'CONFIRM PAYMENT GATEWAY HEALTH',
      description: 'Verify the current health and response behavior of payment-gateway dependencies used by the Payments API.',
      source: 'AI TRIAGE PREVIEW',
      suggestionState: 'NOT ACCEPTED',
      taskRecord: 'NOT CREATED',
      ownership: 'UNASSIGNED',
      status: 'NOT APPLICABLE'
    },
    {
      sequence: '03',
      title: 'RUN CHECKOUT TRANSACTION TEST',
      description: 'Run a controlled checkout transaction test to reproduce the reported card-payment failure.',
      source: 'AI TRIAGE PREVIEW',
      suggestionState: 'NOT ACCEPTED',
      taskRecord: 'NOT CREATED',
      ownership: 'UNASSIGNED',
      status: 'NOT APPLICABLE'
    },
    {
      sequence: '04',
      title: 'PREPARE ROLLBACK',
      description: 'Prepare a rollback option for the latest deployment without executing it until an authorized decision is made.',
      source: 'AI TRIAGE PREVIEW',
      suggestionState: 'NOT ACCEPTED',
      taskRecord: 'NOT CREATED',
      ownership: 'UNASSIGNED',
      status: 'NOT APPLICABLE'
    },
    {
      sequence: '05',
      title: 'DRAFT CUSTOMER-FACING STATUS UPDATE',
      description: 'Prepare a customer-facing status-update draft for human review without publishing it.',
      source: 'AI TRIAGE PREVIEW',
      suggestionState: 'NOT ACCEPTED',
      taskRecord: 'NOT CREATED',
      ownership: 'UNASSIGNED',
      status: 'NOT APPLICABLE'
    }
  ];

  const renderFullTaskWorkspace = (isDrawer: boolean) => {
    return (
      <div className="flex flex-col w-full h-full">
        {/* Only render this panel-like header if not in drawer */}
        {!isDrawer && (
          <div className="border-b border-[#242522] bg-[#141513]/30 px-4 py-3 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <ListTodo className="w-4 h-4 text-[#5C5E58]" aria-hidden="true" />
              <h3 className="text-xs font-mono font-bold text-[#F3F1EA] tracking-wider uppercase" style={{ fontFamily: 'var(--font-technical)' }}>
                RESPONSE TASKS
              </h3>
            </div>
            <span className="text-[8px] px-1.5 py-0.5 bg-[#242522] text-[#A8AAA3] rounded-[1px] font-mono font-bold" style={{ fontFamily: 'var(--font-technical)' }}>
              5 SUGGESTIONS
            </span>
          </div>
        )}

        {/* Header Metadata Sub-rail */}
        <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-[#242522] border-b border-[#242522] bg-[#0E0F0D] shrink-0">
          <div className="px-4 py-2 text-left">
            <span className="block text-[8px] font-mono font-bold text-[#5C5E58] tracking-widest uppercase" style={{ fontFamily: 'var(--font-technical)' }}>
              SUGGESTIONS
            </span>
            <span className="text-[10px] font-mono font-bold text-[#F3F1EA] uppercase" style={{ fontFamily: 'var(--font-technical)' }}>
              5
            </span>
          </div>
          <div className="px-4 py-2 text-left">
            <span className="block text-[8px] font-mono font-bold text-[#5C5E58] tracking-widest uppercase" style={{ fontFamily: 'var(--font-technical)' }}>
              LOCAL PREVIEWS
            </span>
            <span className="text-[10px] font-mono font-bold text-amber-500 uppercase" style={{ fontFamily: 'var(--font-technical)' }}>
              {localPreviews.length}
            </span>
          </div>
          <div className="px-4 py-2 text-left">
            <span className="block text-[8px] font-mono font-bold text-[#5C5E58] tracking-widest uppercase" style={{ fontFamily: 'var(--font-technical)' }}>
              BACKEND RECORDS
            </span>
            <span className="text-[10px] font-mono font-bold text-[#8C8E88] uppercase" style={{ fontFamily: 'var(--font-technical)' }}>
              0
            </span>
          </div>
          <div className="px-4 py-2 text-left">
            <span className="block text-[8px] font-mono font-bold text-[#5C5E58] tracking-widest uppercase" style={{ fontFamily: 'var(--font-technical)' }}>
              QUEUE AUTHORITY
            </span>
            <span className="text-[10px] font-mono font-bold text-amber-500 uppercase" style={{ fontFamily: 'var(--font-technical)' }}>
              BACKEND REQUIRED
            </span>
          </div>
        </div>

        {/* Aria-Live Restrained Notice Banner */}
        {ariaLiveAnnouncement && (
          <div 
            aria-live="polite" 
            className="mx-4 my-3 p-3 border border-amber-500/20 bg-amber-500/5 space-y-1 text-left rounded-[1px]"
          >
            <div className="flex items-center justify-between">
              <span className="block text-[9px] font-mono font-bold text-amber-500 tracking-wider uppercase" style={{ fontFamily: 'var(--font-technical)' }}>
                {ariaLiveAnnouncement.title}
              </span>
              <button 
                onClick={() => setAriaLiveAnnouncement(null)}
                className="text-[#5C5E58] hover:text-[#A8AAA3] text-[9px] font-mono font-bold uppercase cursor-pointer"
              >
                DISMISS
              </button>
            </div>
            <p className="text-[10px] text-[#A8AAA3] leading-relaxed">
              {ariaLiveAnnouncement.desc}
            </p>
          </div>
        )}

        {/* Authority Notice */}
        <div className="p-4 bg-[#141513]/20 border-b border-[#242522] space-y-1.5 text-left shrink-0">
          <span className="block text-[8px] font-mono font-bold text-amber-500 tracking-wider uppercase" style={{ fontFamily: 'var(--font-technical)' }}>
            AI TASK SUGGESTIONS
          </span>
          <p className="text-[11px] text-[#A8AAA3] leading-relaxed">
            These recommendations have not been accepted as IncidentTask records. An authorized human must review them before creation, assignment, or execution.
          </p>
        </div>

        {/* Canonical Task Queue (Ordered List) */}
        <ol className="divide-y divide-[#242522]" aria-label="AI Recommended Response Tasks">
          {suggestedTasks.map((task) => {
            const hasLocalPreview = localPreviews.some(p => p.sequence === task.sequence);
            return (
              <li key={task.sequence} className="p-4 border-b border-[#242522] last:border-b-0 space-y-3">
                {/* Sequence & Title */}
                <div className="flex items-start gap-2 text-left">
                  <span className="text-xs font-mono font-bold text-[#5C5E58] bg-[#141513] px-1.5 py-0.5 rounded-[1px] shrink-0" style={{ fontFamily: 'var(--font-technical)' }}>
                    {task.sequence}
                  </span>
                  <h4 className="text-xs font-mono font-bold text-[#F3F1EA] tracking-wide uppercase leading-tight" style={{ fontFamily: 'var(--font-technical)' }}>
                    {task.title}
                  </h4>
                </div>

                {/* Draft Description Preview */}
                <p className="text-xs text-[#A8AAA3] leading-relaxed font-sans font-normal text-left">
                  {task.description}
                </p>

                {/* Metadata Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-[9px] font-mono text-[#A8AAA3] text-left pt-1" style={{ fontFamily: 'var(--font-technical)' }}>
                  <div className="min-w-0">
                    <span className="block text-[8px] text-[#5C5E58] font-bold tracking-wider uppercase">SOURCE</span>
                    <span className="font-semibold text-[#8C8E88] block truncate">{task.source}</span>
                  </div>
                  <div className="min-w-0">
                    <span className="block text-[8px] text-[#5C5E58] font-bold tracking-wider uppercase">SUGGESTION STATE</span>
                    <span className="font-semibold text-amber-500 block truncate">{task.suggestionState}</span>
                  </div>
                  <div className="min-w-0">
                    <span className="block text-[8px] text-[#5C5E58] font-bold tracking-wider uppercase">TASK RECORD</span>
                    <span className="font-semibold text-[#8C8E88] block truncate">{task.taskRecord}</span>
                  </div>
                  <div className="min-w-0">
                    <span className="block text-[8px] text-[#5C5E58] font-bold tracking-wider uppercase">OWNERSHIP</span>
                    <span className="font-semibold text-[#8C8E88] block truncate">{task.ownership}</span>
                  </div>
                  <div className="min-w-0">
                    <span className="block text-[8px] text-[#5C5E58] font-bold tracking-wider uppercase">STATUS</span>
                    <span className="font-semibold text-[#8C8E88] block truncate">{task.status}</span>
                  </div>
                  <div className="min-w-0">
                    <span className="block text-[8px] text-[#5C5E58] font-bold tracking-wider uppercase">REVIEW STATE</span>
                    <span className="font-semibold text-amber-500 block truncate">
                      {hasLocalPreview ? 'VALIDATED LOCALLY' : 'NOT REVIEWED'}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <span className="block text-[8px] text-[#5C5E58] font-bold tracking-wider uppercase">LOCAL PREVIEW</span>
                    <span className="font-semibold text-amber-500 block truncate">
                      {hasLocalPreview ? 'CREATED' : 'NOT CREATED'}
                    </span>
                  </div>
                  {hasLocalPreview && (
                    <div className="min-w-0">
                      <span className="block text-[8px] text-[#5C5E58] font-bold tracking-wider uppercase">PERSISTENCE</span>
                      <span className="font-semibold text-amber-500 block truncate">NOT CONNECTED</span>
                    </div>
                  )}
                </div>

                {/* Individual Review Control */}
                <div className="pt-1 space-y-1">
                  <button
                    id={`review-task-${task.sequence}`}
                    onClick={() => openDrawer(task)}
                    className="w-full flex items-center justify-between px-3 py-1.5 border border-[#242522] bg-[#141513]/20 hover:bg-[#D6FF3F]/10 hover:border-[#D6FF3F]/40 text-[9px] font-mono font-bold text-[#F3F1EA] hover:text-[#D6FF3F] rounded-[1px] cursor-pointer uppercase transition-colors"
                    style={{ fontFamily: 'var(--font-technical)' }}
                  >
                    <span>REVIEW TASK</span>
                    <span className="text-amber-500/80">PENDING</span>
                  </button>
                  <div className="flex items-center justify-between px-1 text-[8px] font-mono text-[#5C5E58]" style={{ fontFamily: 'var(--font-technical)' }}>
                    <span>TASK CREATION</span>
                    <span className="text-amber-500/60 font-bold">BACKEND REQUIRED</span>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>

        {/* Local Previews Section (Phase 03) */}
        <section className="border-t border-[#242522] bg-[#0E0F0D]" aria-labelledby="local-previews-heading">
          <div className="border-b border-[#242522] bg-[#141513]/30 px-4 py-2.5 flex items-center justify-between shrink-0">
            <h4 id="local-previews-heading" className="text-[10px] font-mono font-bold text-[#F3F1EA] tracking-wider uppercase" style={{ fontFamily: 'var(--font-technical)' }}>
              LOCAL TASK PREVIEWS
            </h4>
            <span className="text-[8px] px-1.5 py-0.5 bg-[#242522] text-[#A8AAA3] rounded-[1px] font-mono font-bold" style={{ fontFamily: 'var(--font-technical)' }}>
              {localPreviews.length} PREVIEWS
            </span>
          </div>

          {localPreviews.length === 0 ? (
            <div className="p-4 text-left space-y-1 bg-[#141513]/10">
              <span className="block text-[9px] font-mono font-bold text-amber-500/80 uppercase" style={{ fontFamily: 'var(--font-technical)' }}>
                NO LOCAL TASK PREVIEWS
              </span>
              <p className="text-[11px] text-[#8C8E88] leading-relaxed">
                Validated task drafts created during this frontend session will appear here without backend persistence.
              </p>
            </div>
          ) : (
            <ol className="divide-y divide-[#242522]" aria-label="Local Task Previews">
              {localPreviews.map((preview, index) => {
                const lpLabel = `LP-0${index + 1}`;
                const lifecycle = getLifecycleState(preview.sequence);
                return (
                  <li key={preview.sequence} className="p-4 space-y-3 bg-[#141513]/5 border-b border-[#242522] last:border-b-0 text-left">
                    {/* LP Header: [LP-01] TITLE */}
                    <div className="flex items-start gap-2 text-left">
                      <span className="text-[10px] font-mono font-bold text-amber-500 bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.5 rounded-[1px] shrink-0" style={{ fontFamily: 'var(--font-technical)' }}>
                        {lpLabel}
                      </span>
                      <div className="space-y-0.5 min-w-0 flex-1">
                        <h5 className="text-xs font-mono font-bold text-[#F3F1EA] tracking-wide uppercase leading-tight" style={{ fontFamily: 'var(--font-technical)' }}>
                          {preview.title}
                        </h5>
                        <div className="flex flex-wrap items-center gap-2 text-[9px] font-mono" style={{ fontFamily: 'var(--font-technical)' }}>
                          <span className="text-[#5C5E58] font-bold">PRIORITY:</span>
                          <span className="text-amber-500 font-bold">{preview.priority}</span>
                          <span className="text-[#242522]">|</span>
                          <span className="text-[#5C5E58] font-bold">STATUS PREVIEW:</span>
                          <span className="text-amber-500 font-bold">{lifecycle.status}</span>
                        </div>
                      </div>
                    </div>

                    {/* Description (Inter) */}
                    <p className="text-xs text-[#A8AAA3] leading-relaxed font-sans font-normal text-left" style={{ fontFamily: 'Inter, sans-serif' }}>
                      {preview.description || <span className="italic text-[#5C5E58]">No description provided.</span>}
                    </p>

                    {/* Metadata block (IBM Plex Mono) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2.5 text-[9px] font-mono text-[#A8AAA3] text-left pt-1" style={{ fontFamily: 'var(--font-technical)' }}>
                      <div className="min-w-0">
                        <span className="block text-[8px] text-[#5C5E58] font-bold tracking-wider uppercase">SOURCE</span>
                        <span className="font-semibold text-[#8C8E88] block truncate">AI</span>
                      </div>
                      <div className="min-w-0">
                        <span className="block text-[8px] text-[#5C5E58] font-bold tracking-wider uppercase">OWNERSHIP</span>
                        <span className="font-semibold text-[#8C8E88] block truncate">{lifecycle.ownership}</span>
                      </div>
                      <div className="min-w-0">
                        <span className="block text-[8px] text-[#5C5E58] font-bold tracking-wider uppercase">ASSIGNEE DATA</span>
                        <span className="font-semibold text-[#8C8E88] block truncate">NOT LOADED</span>
                      </div>
                      <div className="min-w-0">
                        <span className="block text-[8px] text-[#5C5E58] font-bold tracking-wider uppercase">CLAIM STATE</span>
                        <span className="font-semibold text-[#8C8E88] block truncate">{lifecycle.claimState}</span>
                      </div>
                      <div className="min-w-0 col-span-1 sm:col-span-2">
                        <span className="block text-[8px] text-[#5C5E58] font-bold tracking-wider uppercase">DUE TIME</span>
                        <span className="font-semibold text-[#8C8E88] block truncate">
                          {preview.dueTime ? 'LOCAL VALUE PROVIDED' : 'NOT SET'}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <span className="block text-[8px] text-[#5C5E58] font-bold tracking-wider uppercase">BLOCKING REASON</span>
                        <span className="font-semibold text-[#8C8E88] block truncate">
                          {lifecycle.blockingState === 'BLOCKED LOCALLY' ? 'LOCAL VALUE PROVIDED' : 'NOT APPLICABLE'}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <span className="block text-[8px] text-[#5C5E58] font-bold tracking-wider uppercase">COMPLETION STATE</span>
                        <span className="font-semibold text-[#8C8E88] block truncate">{lifecycle.completionState}</span>
                      </div>
                      <div className="min-w-0">
                        <span className="block text-[8px] text-[#5C5E58] font-bold tracking-wider uppercase">PERSISTENCE</span>
                        <span className="font-semibold text-amber-500 block truncate">NOT CONNECTED</span>
                      </div>
                      <div className="min-w-0 col-span-1 sm:col-span-2">
                        <span className="block text-[8px] text-[#5C5E58] font-bold tracking-wider uppercase">RECORD AUTHORITY</span>
                        <span className="font-semibold text-amber-500 block truncate">BACKEND REQUIRED</span>
                      </div>
                    </div>

                    {/* Local Preview Actions */}
                    <div className="pt-2 space-y-2">
                      <button
                        id={`lifecycle-task-${preview.sequence}`}
                        onClick={() => openLifecycleDrawer(preview)}
                        className="w-full flex items-center justify-between px-3 py-1.5 border border-[#242522] bg-[#141513]/20 hover:bg-amber-500/10 hover:border-amber-500/40 text-[9px] font-mono font-bold text-[#F3F1EA] hover:text-amber-500 rounded-[1px] cursor-pointer uppercase transition-colors"
                        style={{ fontFamily: 'var(--font-technical)' }}
                      >
                        <span>OPEN TASK LIFECYCLE</span>
                        <span className="text-amber-500">LOCAL PREVIEW</span>
                      </button>
                      <button
                        disabled
                        aria-disabled="true"
                        className="w-full flex items-center justify-between px-3 py-1.5 border border-[#242522] bg-[#141513]/10 text-[9px] font-mono font-bold text-[#5C5E58] rounded-[1px] cursor-not-allowed uppercase"
                        style={{ fontFamily: 'var(--font-technical)' }}
                      >
                        <span>NEXT PHASE</span>
                        <span className="text-[#5C5E58]">DISABLED</span>
                      </button>
                      <button
                        onClick={() => removeLocalPreview(preview.sequence)}
                        className="w-full py-1.5 px-3 border border-red-900/30 bg-red-950/10 hover:bg-red-950/20 text-[9px] font-mono font-bold text-red-500 hover:text-red-400 rounded-[1px] cursor-pointer uppercase transition-colors text-center"
                        style={{ fontFamily: 'var(--font-technical)' }}
                      >
                        REMOVE LOCAL PREVIEW
                      </button>
                    </div>
                  </li>
                );
              })}
            </ol>
          )}
        </section>

        {/* Review controls (Panel-level actions) */}
        <div className="p-4 border-t border-[#242522] bg-[#141513]/20 space-y-4 text-left shrink-0">
          <div className="space-y-1">
            <span className="block text-[8px] font-mono font-bold text-amber-500 tracking-wider uppercase" style={{ fontFamily: 'var(--font-technical)' }}>
              BACKEND AUTHORITY REQUIRED
            </span>
            <p className="text-[11px] text-[#8C8E88] leading-relaxed">
              Task review and creation will become available after authenticated membership, permission enforcement, and task persistence are connected.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <button
              disabled
              aria-disabled="true"
              className="w-full py-2 px-3 border border-[#242522] bg-[#141513]/25 text-[10px] font-mono font-bold text-[#5C5E58] rounded-[1px] cursor-not-allowed text-center uppercase"
              style={{ fontFamily: 'var(--font-technical)' }}
            >
              ACCEPT ALL SUGGESTIONS
            </button>
            <button
              disabled
              aria-disabled="true"
              className="w-full py-2 px-3 border border-[#242522] bg-[#141513]/25 text-[10px] font-mono font-bold text-[#5C5E58] rounded-[1px] cursor-not-allowed text-center uppercase"
              style={{ fontFamily: 'var(--font-technical)' }}
            >
              CREATE CUSTOM TASK
            </button>
          </div>

          <button
            onClick={clearLocalPreviews}
            disabled={localPreviews.length === 0}
            aria-disabled={localPreviews.length === 0}
            className={`w-full py-2.5 px-4 font-mono font-bold text-[10px] rounded-[1px] tracking-wider text-center uppercase transition-colors ${
              localPreviews.length > 0
                ? 'border border-amber-500/40 bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 cursor-pointer'
                : 'border border-[#242522] bg-[#141513]/25 text-[#5C5E58] cursor-not-allowed'
            }`}
            style={{ fontFamily: 'var(--font-technical)' }}
          >
            CLEAR LOCAL PREVIEWS
          </button>
        </div>

        {/* TASK CONTRACT FOOTER */}
        <div className="border-t border-[#242522] bg-[#141513]/10 p-4 space-y-3 w-full text-left shrink-0">
          <div className="flex items-center justify-between border-b border-[#242522]/40 pb-1.5">
            <span className="block text-[8px] font-mono font-bold text-[#5C5E58] tracking-widest uppercase" style={{ fontFamily: 'var(--font-technical)' }}>
              TASK CONTRACT
            </span>
            <span className="text-[8px] font-mono font-bold text-amber-500 uppercase" style={{ fontFamily: 'var(--font-technical)' }}>
              FUTURE SPECIFICATION
            </span>
          </div>

          <div className="grid grid-cols-1 gap-2.5 text-[9px] font-mono text-[#A8AAA3]" style={{ fontFamily: 'var(--font-technical)' }}>
            <div className="flex items-center justify-between border-b border-[#242522]/20 pb-1">
              <span className="text-[#5C5E58] font-bold uppercase text-[8px]">TITLE</span>
              <span className="font-semibold text-[#8C8E88]">REQUIRED</span>
            </div>
            <div className="flex items-center justify-between border-b border-[#242522]/20 pb-1">
              <span className="text-[#5C5E58] font-bold uppercase text-[8px]">DESCRIPTION</span>
              <span className="font-semibold text-[#8C8E88]">OPTIONAL</span>
            </div>
            <div className="flex items-center justify-between border-b border-[#242522]/20 pb-1">
              <span className="text-[#5C5E58] font-bold uppercase text-[8px]">PRIORITY</span>
              <span className="font-semibold text-[#8C8E88]">REQUIRED AFTER CREATION</span>
            </div>
            <div className="flex items-center justify-between border-b border-[#242522]/20 pb-1">
              <span className="text-[#5C5E58] font-bold uppercase text-[8px]">STATUS</span>
              <span className="font-semibold text-[#8C8E88]">TODO AFTER CREATION</span>
            </div>
            <div className="flex items-center justify-between border-b border-[#242522]/20 pb-1">
              <span className="text-[#5C5E58] font-bold uppercase text-[8px]">ASSIGNEE</span>
              <span className="font-semibold text-[#8C8E88]">ACTIVE MEMBER ONLY</span>
            </div>
            <div className="flex items-center justify-between border-b border-[#242522]/20 pb-1">
              <span className="text-[#5C5E58] font-bold uppercase text-[8px]">SOURCE</span>
              <span className="font-semibold text-[#8C8E88]">AI</span>
            </div>
            <div className="flex items-center justify-between border-b border-[#242522]/20 pb-1">
              <span className="text-[#5C5E58] font-bold uppercase text-[8px]">BLOCKING REASON</span>
              <span className="font-semibold text-[#8C8E88]">REQUIRED WHEN BLOCKED</span>
            </div>
            <div className="flex items-center justify-between border-b border-[#242522]/20 pb-1">
              <span className="text-[#5C5E58] font-bold uppercase text-[8px]">COMPLETION TIME</span>
              <span className="font-semibold text-[#8C8E88]">SERVER GENERATED</span>
            </div>
            <div className="flex items-center justify-between border-b border-[#242522]/20 pb-1">
              <span className="text-[#5C5E58] font-bold uppercase text-[8px]">CLAIM SAFETY</span>
              <span className="font-semibold text-amber-500">SERVER REQUIRED</span>
            </div>
            <div className="flex items-center justify-between border-b border-[#242522]/20 pb-1">
              <span className="text-[#5C5E58] font-bold uppercase text-[8px]">LOCAL PREVIEW STATE</span>
              <span className="font-semibold text-amber-500 uppercase">NON-AUTHORITATIVE</span>
            </div>
          </div>

          <div className="pt-1.5 space-y-1">
            <p className="text-[10px] text-[#8C8E88] leading-relaxed">
              Only backend-created IncidentTask records may participate in assignment, claim, block, completion, realtime synchronization, and audit history.
            </p>
            <p className="text-[10px] text-[#8C8E88] leading-relaxed">
              Task claiming must be concurrency-safe and cannot assign the same task to two responders.
            </p>
            <p className="text-[9px] text-[#5C5E58] italic leading-normal">
              This contract describes future backend behavior only. Do not create these values as current task records.
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 pb-16 lg:pb-6">
      {/* 1. CRITICAL INCIDENT IDENTITY (Always visible above columns and tabs) */}
      <div 
        id="incident-identity"
        className="border border-[#242522] bg-[#0E0F0D] p-4 sm:p-6 rounded-[2px] relative overflow-hidden"
      >
        {/* Subtle decorative background indicator for active Sev1 */}
        <div 
          className="absolute left-0 top-0 bottom-0 w-1.5 bg-red-600" 
          aria-hidden="true" 
        />

        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
          <div className="space-y-3 max-w-3xl text-left">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-xs font-mono font-bold text-red-500 bg-red-500/5 border border-red-500/20 px-2 py-0.5 rounded-[1px] tracking-wider whitespace-nowrap">
                SF-2026-0042
              </span>
              <span className="text-xs font-mono font-bold text-[#A8AAA3] bg-[#141513] border border-[#242522] px-2 py-0.5 rounded-[1px] tracking-wider whitespace-nowrap">
                STATUS: REPORTED
              </span>
              <span 
                className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-[#D6FF3F] bg-[#D6FF3F]/5 border border-[#D6FF3F]/10 px-2 py-0.5 rounded-[1px] tracking-wider"
                style={{ fontFamily: 'var(--font-technical)' }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#D6FF3F] animate-pulse" />
                AI SUGGESTION / SEV1
              </span>
            </div>

            <h2 className="text-lg sm:text-xl font-sans font-extrabold tracking-tight text-[#F3F1EA] uppercase leading-tight">
              Checkout payments failing after latest deployment
            </h2>

            {/* Crucial system warning warning that SEV1 is unconfirmed */}
            <div className="inline-flex items-center gap-2 text-[11px] font-mono font-bold text-amber-500 bg-amber-500/5 border border-amber-500/10 px-3 py-1 rounded-[1px]">
              <ShieldAlert className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              <span>SEVERITY AUTHORITY: HUMAN CONFIRMATION REQUIRED</span>
            </div>
          </div>

          {/* Quick Stats Grid inside the Identity block */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-1 gap-x-6 gap-y-3 pt-4 lg:pt-0 lg:pl-6 border-t lg:border-t-0 lg:border-l border-[#242522] min-w-[200px] text-left">
            <div>
              <span className="block text-[8px] text-[#5C5E58] font-bold uppercase tracking-widest" style={{ fontFamily: 'var(--font-technical)' }}>
                CUSTOMER SIGNAL
              </span>
              <span className="text-xs font-mono font-bold text-[#F3F1EA] tracking-wide" style={{ fontFamily: 'var(--font-technical)' }}>
                37 REPORTS / 12 Mins
              </span>
            </div>
            <div>
              <span className="block text-[8px] text-[#5C5E58] font-bold uppercase tracking-widest" style={{ fontFamily: 'var(--font-technical)' }}>
                SERVICE IMPACTED
              </span>
              <span className="text-xs font-mono font-bold text-[#F3F1EA] tracking-wide" style={{ fontFamily: 'var(--font-technical)' }}>
                PAYMENTS API
              </span>
            </div>
            <div>
              <span className="block text-[8px] text-[#5C5E58] font-bold uppercase tracking-widest" style={{ fontFamily: 'var(--font-technical)' }}>
                COMMANDER
              </span>
              <span className="text-xs font-mono font-bold text-amber-500 tracking-wide" style={{ fontFamily: 'var(--font-technical)' }}>
                UNASSIGNED
              </span>
            </div>
          </div>
        </div>

        {/* Detailed context fields in dense form */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 pt-4 border-t border-[#242522] text-left">
          <div>
            <span className="block text-[8px] text-[#5C5E58] font-bold uppercase tracking-widest" style={{ fontFamily: 'var(--font-technical)' }}>
              STARTED / DETECTED
            </span>
            <span className="text-[11px] font-mono text-[#A8AAA3]" style={{ fontFamily: 'var(--font-technical)' }}>
              NOT AVAILABLE
            </span>
          </div>
          <div>
            <span className="block text-[8px] text-[#5C5E58] font-bold uppercase tracking-widest" style={{ fontFamily: 'var(--font-technical)' }}>
              AI TRIAGE CONFIDENCE
            </span>
            <span className="text-[11px] font-mono text-[#A8AAA3]" style={{ fontFamily: 'var(--font-technical)' }}>
              NOT AVAILABLE
            </span>
          </div>
        </div>
      </div>

      {/* 2. HEADER OPERATIONAL ACTIONS (Visibly disabled, exposing backend-only authority constraint) */}
      <div 
        id="operational-controls"
        className="border border-[#242522] bg-[#0E0F0D] p-4 rounded-[2px] flex flex-col md:flex-row md:items-center justify-between gap-4 text-left"
      >
        <div className="space-y-1">
          <h3 className="text-xs font-mono font-bold text-[#F3F1EA] tracking-wider uppercase" style={{ fontFamily: 'var(--font-technical)' }}>
            INCIDENT COMMAND CONTROLS
          </h3>
          <p className="text-[11px] text-[#A8AAA3]">
            Operational controls are disabled during this preview phase.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Lock indication badge */}
          <div className="inline-flex items-center gap-1 text-[9px] font-mono font-bold text-amber-500 border border-amber-500/20 bg-amber-500/5 px-2.5 py-1 rounded-[1px] mr-1" style={{ fontFamily: 'var(--font-technical)' }}>
            <Lock className="w-3 h-3" aria-hidden="true" />
            <span>BACKEND AUTHORITY REQUIRED</span>
          </div>

          <button
            type="button"
            disabled
            aria-disabled="true"
            className="px-2.5 py-1 text-[10px] font-mono font-bold tracking-wider text-[#5C5E58] border border-[#242522] bg-[#141513]/30 rounded-[1px] cursor-not-allowed opacity-50"
            style={{ fontFamily: 'var(--font-technical)' }}
          >
            ADD NOTE
          </button>
          <button
            type="button"
            disabled
            aria-disabled="true"
            className="px-2.5 py-1 text-[10px] font-mono font-bold tracking-wider text-[#5C5E58] border border-[#242522] bg-[#141513]/30 rounded-[1px] cursor-not-allowed opacity-50"
            style={{ fontFamily: 'var(--font-technical)' }}
          >
            CHANGE STATUS
          </button>
          <button
            type="button"
            disabled
            aria-disabled="true"
            className="px-2.5 py-1 text-[10px] font-mono font-bold tracking-wider text-[#5C5E58] border border-[#242522] bg-[#141513]/30 rounded-[1px] cursor-not-allowed opacity-50"
            style={{ fontFamily: 'var(--font-technical)' }}
          >
            CHANGE SEVERITY
          </button>
          <button
            type="button"
            disabled
            aria-disabled="true"
            className="px-2.5 py-1 text-[10px] font-mono font-bold tracking-wider text-[#5C5E58] border border-[#242522] bg-[#141513]/30 rounded-[1px] cursor-not-allowed opacity-50"
            style={{ fontFamily: 'var(--font-technical)' }}
          >
            ASSIGN COMMANDER
          </button>
          <button
            type="button"
            disabled
            aria-disabled="true"
            className="px-2.5 py-1 text-[10px] font-mono font-bold tracking-wider text-[#5C5E58] border border-[#242522] bg-[#141513]/30 rounded-[1px] cursor-not-allowed opacity-50"
            style={{ fontFamily: 'var(--font-technical)' }}
          >
            RESOLVE INCIDENT
          </button>
        </div>
      </div>

      {/* 3. MOBILE RESPONSIVE TABS (Visible below 1000px, hidden on desktop >= 1000px) */}
      <div className="block min-[1000px]:hidden">
        <div 
          className="border-b border-[#242522] flex gap-2" 
          role="tablist" 
          aria-label="Incident Room Sections"
        >
          {(['TIMELINE', 'TASKS', 'DETAILS'] as MobileTab[]).map((tab) => (
            <button
              key={tab}
              id={`tab-${tab}`}
              role="tab"
              aria-selected={activeTab === tab}
              aria-controls={`panel-${tab}`}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-3 text-center text-xs font-mono font-bold tracking-widest border-b-2 transition-all cursor-pointer ${
                activeTab === tab 
                  ? 'border-[#D6FF3F] text-[#D6FF3F] bg-[#141513]/20' 
                  : 'border-transparent text-[#5C5E58] hover:text-[#A8AAA3]'
              }`}
              style={{ fontFamily: 'var(--font-technical)' }}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* 4. MAIN OPERATIONAL GRID LAYOUT */}
      <div id="incident-room-grid" className="grid grid-cols-1 min-[1000px]:grid-cols-[minmax(0,_2fr)_minmax(320px,_1fr)] gap-6">
        
        {/* LEFT / MAIN WORKSPACE (Visible on desktop OR when mobile 'TIMELINE' tab is active) */}
        <main 
          id="panel-TIMELINE"
          role="tabpanel"
          aria-labelledby="tab-TIMELINE"
          className={`main-workspace min-w-0 w-full max-w-full flex flex-col gap-6 min-[1000px]:block min-[1000px]:flex ${
            activeTab === 'TIMELINE' ? 'flex' : 'hidden'
          }`}
        >
          {/* AI Triage Review Panel */}
          <section 
            id="panel-AI-TRIAGE"
            aria-labelledby="ai-triage-heading"
            className="border border-[#242522] bg-[#0E0F0D] rounded-[2px] overflow-hidden flex flex-col"
          >
            {/* Panel Header */}
            <div className="border-b border-[#242522] bg-[#141513]/30 px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-left">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-500" aria-hidden="true" />
                  <h3 
                    id="ai-triage-heading" 
                    className="text-xs font-bold text-[#F3F1EA] tracking-wider uppercase"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    AI TRIAGE REVIEW
                  </h3>
                </div>
                <span 
                  className="block text-[8px] font-mono font-bold text-[#5C5E58] tracking-widest uppercase"
                  style={{ fontFamily: 'var(--font-technical)' }}
                >
                  STRUCTURED SUGGESTION / FRONTEND PREVIEW
                </span>
              </div>
              
              <div className="flex flex-wrap items-center gap-2 text-[9px] font-mono" style={{ fontFamily: 'var(--font-technical)' }}>
                <div className="px-2 py-0.5 border border-amber-500/20 bg-amber-500/5 rounded-[1px] text-[#A8AAA3]">
                  AI SERVICE: <span className="text-amber-500 font-bold">NOT CONNECTED</span>
                </div>
                <div className="px-2 py-0.5 border border-[#242522] bg-[#141513]/50 rounded-[1px] text-[#8C8E88]">
                  MODEL TARGET: <span className="text-[#A8AAA3] font-bold">DEEPSEEK-V4-FLASH</span>
                </div>
                <div className="px-2 py-0.5 border border-amber-500/20 bg-amber-500/5 rounded-[1px] text-[#A8AAA3]">
                  OUTPUT STATE: <span className="text-amber-500/80 font-bold">DRAFT SUGGESTION</span>
                </div>
              </div>
            </div>

            {/* Authority Notice */}
            <div className="border-b border-[#242522] bg-[#141513]/40 p-4 text-left">
              <div className="flex items-start gap-2.5">
                <ShieldAlert className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" aria-hidden="true" />
                <div className="space-y-1">
                  <h4 
                    className="text-xs font-bold text-[#F3F1EA] tracking-wide uppercase"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    AI ASSISTS. HUMANS DECIDE.
                  </h4>
                  <p className="text-xs text-[#A8AAA3] leading-relaxed max-w-3xl">
                    This structured preview does not change incident severity, status, ownership, or response tasks. An authorized human must review and explicitly accept or edit every operational recommendation.
                  </p>
                </div>
              </div>
            </div>

            {/* Structured Analysis Body */}
            <div className="divide-y divide-[#242522] text-left">
              
              {/* TOP REGION: Summary and Severity in balanced 2-column on desktop */}
              <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-[#242522]">
                
                {/* 01 / INCIDENT SUMMARY */}
                <div className="p-4 sm:p-5 space-y-2.5">
                  <div className="flex items-center gap-2">
                    <span 
                      className="text-[10px] font-mono font-bold text-[#5C5E58] tracking-wider"
                      style={{ fontFamily: 'var(--font-technical)' }}
                    >
                      01 / INCIDENT SUMMARY
                    </span>
                  </div>
                  <p className="text-xs text-[#A8AAA3] leading-relaxed">
                    Customers cannot complete card payments after the latest deployment. Support has recorded 37 customer reports within the documented 12-minute signal window, with the Payments API identified as the affected service.
                  </p>
                </div>

                {/* 02 / SEVERITY SUGGESTION */}
                <div className="p-4 sm:p-5 space-y-3">
                  <div>
                    <span 
                      className="block text-[10px] font-mono font-bold text-[#5C5E58] tracking-wider mb-2"
                      style={{ fontFamily: 'var(--font-technical)' }}
                    >
                      02 / SEVERITY SUGGESTION
                    </span>
                    <div className="flex items-baseline gap-2">
                      <span 
                        className="text-xs font-mono text-[#8C8E88]"
                        style={{ fontFamily: 'var(--font-technical)' }}
                      >
                        Suggested severity:
                      </span>
                      <span 
                        className="text-sm font-mono font-bold text-red-500 bg-red-500/5 border border-red-500/20 px-2 py-0.5 rounded-[1px]"
                        style={{ fontFamily: 'var(--font-technical)' }}
                      >
                        SEV1 [AI SUGGESTION]
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1.5 pt-2.5 border-t border-[#242522]/50">
                    <div className="flex justify-between items-center text-[10px] font-mono" style={{ fontFamily: 'var(--font-technical)' }}>
                      <span className="text-[#5C5E58]">AUTHORITY STATE:</span>
                      <span className="text-amber-500 font-bold">HUMAN CONFIRMATION REQUIRED</span>
                    </div>
                    <div className="flex justify-between items-center text-[10px] font-mono" style={{ fontFamily: 'var(--font-technical)' }}>
                      <span className="text-[#5C5E58]">CURRENT CONFIRMED SEVERITY:</span>
                      <span className="text-[#8C8E88] font-bold">NOT CONFIRMED</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* SECOND REGION: Affected Area and Impact in balanced 2-column on desktop */}
              <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-[#242522]">
                
                {/* 03 / AFFECTED AREA */}
                <div className="p-4 sm:p-5 space-y-3">
                  <div>
                    <span 
                      className="block text-[10px] font-mono font-bold text-[#5C5E58] tracking-wider mb-2"
                      style={{ fontFamily: 'var(--font-technical)' }}
                    >
                      03 / AFFECTED AREA
                    </span>
                    <span 
                      className="inline-block text-xs font-mono font-bold text-[#F3F1EA] bg-[#141513] border border-[#242522] px-2.5 py-1 rounded-[1px]"
                      style={{ fontFamily: 'var(--font-technical)' }}
                    >
                      PAYMENTS API
                    </span>
                  </div>

                  <div className="space-y-1">
                    <span 
                      className="block text-[8px] font-mono font-bold text-[#5C5E58] tracking-widest uppercase"
                      style={{ fontFamily: 'var(--font-technical)' }}
                    >
                      EVIDENCE BASIS
                    </span>
                    <ul className="text-xs text-[#A8AAA3] space-y-1 list-disc list-inside">
                      <li>Customer payment failures</li>
                      <li>Latest deployment mentioned in the incident report</li>
                      <li>37 customer reports / 12 minutes</li>
                    </ul>
                  </div>

                  <div className="pt-2 border-t border-[#242522]/50 flex justify-between items-center text-[10px] font-mono" style={{ fontFamily: 'var(--font-technical)' }}>
                    <span className="text-[#5C5E58]">DEPLOYMENT RELATION:</span>
                    <span className="text-[#8C8E88] font-bold">WORKING HYPOTHESIS</span>
                  </div>
                </div>

                {/* 04 / CUSTOMER & BUSINESS IMPACT */}
                <div className="p-4 sm:p-5 space-y-3">
                  <span 
                    className="block text-[10px] font-mono font-bold text-[#5C5E58] tracking-wider"
                    style={{ fontFamily: 'var(--font-technical)' }}
                  >
                    04 / CUSTOMER & BUSINESS IMPACT
                  </span>
                  
                  <div className="space-y-2 text-xs">
                    <div>
                      <span className="block text-[8px] font-mono font-bold text-[#5C5E58] tracking-widest uppercase mb-0.5" style={{ fontFamily: 'var(--font-technical)' }}>
                        KNOWN IMPACT
                      </span>
                      <p className="text-[#A8AAA3]">Customers cannot complete card payments.</p>
                    </div>
                    <div>
                      <span className="block text-[8px] font-mono font-bold text-[#5C5E58] tracking-widest uppercase mb-0.5" style={{ fontFamily: 'var(--font-technical)' }}>
                        CURRENT EVIDENCE
                      </span>
                      <p className="text-[#A8AAA3]">37 customer reports are documented.</p>
                    </div>
                  </div>

                  <div className="pt-2.5 border-t border-[#242522]/50 flex justify-between items-center text-[10px] font-mono" style={{ fontFamily: 'var(--font-technical)' }}>
                    <span className="text-[#5C5E58]">FINAL IMPACT STATE:</span>
                    <span className="text-amber-500 font-bold">NOT RECONCILED</span>
                  </div>
                </div>

              </div>

              {/* 05 / CONFIDENCE */}
              <div className="p-4 sm:p-5 space-y-1.5 w-full max-w-[680px] min-w-0">
                <span 
                  className="block text-[10px] font-mono font-bold text-[#5C5E58] tracking-wider"
                  style={{ fontFamily: 'var(--font-technical)' }}
                >
                  05 / CONFIDENCE
                </span>
                <div className="flex items-center gap-2">
                  <span 
                    className="text-xs font-mono font-bold text-[#8C8E88] bg-[#141513] border border-[#242522] px-2 py-0.5 rounded-[1px]"
                    style={{ fontFamily: 'var(--font-technical)' }}
                  >
                    CONFIDENCE SCORE: NOT AVAILABLE
                  </span>
                </div>
                <p className="text-xs text-[#A8AAA3] leading-relaxed w-full max-w-[640px] min-w-0 whitespace-normal break-normal [overflow-wrap:break-word]">
                  A validated confidence score will be displayed only after a real AI response is received and structurally verified.
                </p>
              </div>

              {/* 06 / RISK FLAGS */}
              <div className="p-4 sm:p-5 space-y-2">
                <span 
                  className="block text-[10px] font-mono font-bold text-[#5C5E58] tracking-wider"
                  style={{ fontFamily: 'var(--font-technical)' }}
                >
                  06 / RISK FLAGS
                </span>
                <div className="flex flex-wrap gap-2 text-[10px] font-mono" style={{ fontFamily: 'var(--font-technical)' }}>
                  <span className="px-2.5 py-1 bg-[#141513] border border-red-500/20 text-red-400 font-bold rounded-[1px]">
                    CUSTOMER-FACING PAYMENT FAILURE
                  </span>
                  <span className="px-2.5 py-1 bg-[#141513] border border-amber-500/20 text-amber-400 font-bold rounded-[1px]">
                    BUSINESS-CRITICAL FLOW AFFECTED
                  </span>
                  <span className="px-2.5 py-1 bg-[#141513] border border-[#242522] text-[#8C8E88] font-bold rounded-[1px]">
                    DEPLOYMENT CORRELATION UNCONFIRMED
                  </span>
                </div>
              </div>

              {/* 07 / CLARIFYING QUESTIONS */}
              <div className="p-4 sm:p-5 space-y-3">
                <span 
                  className="block text-[10px] font-mono font-bold text-[#5C5E58] tracking-wider"
                  style={{ fontFamily: 'var(--font-technical)' }}
                >
                  07 / CLARIFYING QUESTIONS
                </span>
                
                <ol className="text-xs text-[#A8AAA3] space-y-2 list-decimal list-inside pl-1">
                  <li className="leading-relaxed">
                    Which deployment changes affected the Payments API immediately before the reports began?
                  </li>
                  <li className="leading-relaxed">
                    Are payment failures reproducible across all card-payment attempts or only specific gateways or transaction paths?
                  </li>
                  <li className="leading-relaxed">
                    What is the confirmed transaction and customer impact after reconciliation?
                  </li>
                </ol>

                <div className="pt-2 text-[9px] font-mono text-[#5C5E58] font-bold tracking-widest uppercase" style={{ fontFamily: 'var(--font-technical)' }}>
                  DRAFT QUESTIONS / HUMAN REVIEW REQUIRED
                </div>
              </div>

              {/* 08 / SUGGESTED IMMEDIATE ACTION */}
              <div className="p-4 sm:p-5 space-y-1.5 block w-full max-w-[760px] min-w-0">
                <span 
                  className="block text-[10px] font-mono font-bold text-[#5C5E58] tracking-wider"
                  style={{ fontFamily: 'var(--font-technical)' }}
                >
                  08 / SUGGESTED IMMEDIATE ACTION
                </span>
                <p className="text-xs font-mono font-bold text-amber-500 uppercase leading-relaxed w-full max-w-[720px] whitespace-normal break-normal" style={{ fontFamily: 'var(--font-technical)' }}>
                  VERIFY PAYMENT GATEWAY HEALTH AND COMPARE THE LATEST DEPLOYMENT CHANGES.
                </p>
                <p className="text-xs text-[#A8AAA3] leading-relaxed w-full max-w-[640px] whitespace-normal break-normal">
                  This is a suggested next action only. An authorized responder or Incident Manager must decide whether to proceed.
                </p>
              </div>

              {/* RECOMMENDED RESPONSE TASKS */}
              <div className="p-4 sm:p-5 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#242522]/50 pb-2">
                  <span 
                    className="block text-[10px] font-mono font-bold text-[#5C5E58] tracking-wider"
                    style={{ fontFamily: 'var(--font-technical)' }}
                  >
                    RECOMMENDED RESPONSE TASKS
                  </span>
                  <div className="inline-flex items-center gap-1.5 px-2 py-0.5 border border-[#242522] bg-[#141513]/40 rounded-[1px] text-[9px] font-mono font-bold text-[#8C8E88]" style={{ fontFamily: 'var(--font-technical)' }}>
                    <span>5 SUGGESTIONS</span>
                    <span className="text-[#5C5E58]">/</span>
                    <span className="text-amber-500">NOT ACCEPTED</span>
                  </div>
                </div>

                <div className="divide-y divide-[#242522]/50 font-mono text-[10px]" style={{ fontFamily: 'var(--font-technical)' }}>
                  {[
                    { id: '01', text: 'COMPARE LATEST DEPLOYMENT CHANGES' },
                    { id: '02', text: 'CONFIRM PAYMENT GATEWAY HEALTH' },
                    { id: '03', text: 'RUN CHECKOUT TRANSACTION TEST' },
                    { id: '04', text: 'PREPARE ROLLBACK' },
                    { id: '05', text: 'DRAFT CUSTOMER-FACING STATUS UPDATE' }
                  ].map((task) => (
                    <div key={task.id} className="py-2.5 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-start gap-2">
                        <span className="text-[#5C5E58] font-bold">{task.id}</span>
                        <span className="text-[#F3F1EA] font-bold">{task.text}</span>
                      </div>
                      <div className="flex flex-wrap gap-2 text-[9px]">
                        <span className="px-1.5 py-0.5 bg-[#141513] border border-[#242522] text-[#8C8E88]">
                          SOURCE: <span className="text-amber-500 font-bold">AI TRIAGE PREVIEW</span>
                        </span>
                        <span className="px-1.5 py-0.5 bg-[#141513] border border-[#242522] text-[#8C8E88]">
                          RECORD STATE: <span className="text-[#5C5E58] font-bold">NOT CREATED</span>
                        </span>
                        <span className="px-1.5 py-0.5 bg-[#141513] border border-[#242522] text-[#8C8E88]">
                          OWNERSHIP: <span className="text-[#5C5E58] font-bold">UNASSIGNED</span>
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* REVIEW ACTIONS */}
              <div className="p-4 sm:p-5 bg-[#141513]/20 flex flex-col gap-4 w-full min-w-0">
                <div className="flex">
                  <span className="inline-flex items-center gap-1.5 text-[9px] font-mono font-bold text-amber-500 border border-amber-500/20 bg-amber-500/5 px-2.5 py-1 rounded-[1px]" style={{ fontFamily: 'var(--font-technical)' }}>
                    <Lock className="w-3 h-3" aria-hidden="true" />
                    <span>BACKEND AUTHORITY REQUIRED</span>
                  </span>
                </div>
                
                <p className="text-xs text-[#A8AAA3] w-full max-w-[720px] min-w-0 whitespace-normal break-normal [overflow-wrap:break-word] leading-relaxed">
                  Review controls will become available after authenticated membership, permission enforcement, and AI-output persistence are connected.
                </p>

                <div className="flex flex-col sm:flex-row flex-wrap items-center gap-2 w-full min-w-0">
                  <button
                    type="button"
                    disabled
                    aria-disabled="true"
                    className="w-full sm:w-auto px-4 py-2 text-xs font-mono font-bold tracking-wider text-[#5C5E58] border border-[#242522] bg-[#141513]/30 rounded-[1px] cursor-not-allowed opacity-50 uppercase"
                    style={{ fontFamily: 'var(--font-technical)' }}
                  >
                    ACCEPT SEVERITY SUGGESTION
                  </button>
                  <button
                    type="button"
                    disabled
                    aria-disabled="true"
                    className="w-full sm:w-auto px-4 py-2 text-xs font-mono font-bold tracking-wider text-[#5C5E58] border border-[#242522] bg-[#141513]/30 rounded-[1px] cursor-not-allowed opacity-50 uppercase"
                    style={{ fontFamily: 'var(--font-technical)' }}
                  >
                    EDIT SUGGESTION
                  </button>
                  <button
                    type="button"
                    disabled
                    aria-disabled="true"
                    className="w-full sm:w-auto px-4 py-2 text-xs font-mono font-bold tracking-wider text-[#5C5E58] border border-[#242522] bg-[#141513]/30 rounded-[1px] cursor-not-allowed opacity-50 uppercase"
                    style={{ fontFamily: 'var(--font-technical)' }}
                  >
                    REJECT SUGGESTION
                  </button>
                  <button
                    type="button"
                    disabled
                    aria-disabled="true"
                    className="w-full sm:w-auto px-4 py-2 text-xs font-mono font-bold tracking-wider text-[#5C5E58] border border-[#242522] bg-[#141513]/30 rounded-[1px] cursor-not-allowed opacity-50 uppercase"
                    style={{ fontFamily: 'var(--font-technical)' }}
                  >
                    ADD RECOMMENDED TASKS
                  </button>
                </div>
              </div>

              {/* AI OUTPUT CONTRACT */}
              <div className="p-4 sm:p-5 bg-[#141513]/10 space-y-3">
                <span 
                  className="block text-[8px] font-mono font-bold text-[#5C5E58] tracking-widest uppercase"
                  style={{ fontFamily: 'var(--font-technical)' }}
                >
                  OUTPUT CONTRACT
                </span>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 text-[9px] font-mono text-[#A8AAA3]" style={{ fontFamily: 'var(--font-technical)' }}>
                  <div>
                    <span className="block text-[#5C5E58] uppercase">STRUCTURED RESPONSE</span>
                    <span className="font-bold text-[#8C8E88]">REQUIRED</span>
                  </div>
                  <div>
                    <span className="block text-[#5C5E58] uppercase">SCHEMA VALIDATION</span>
                    <span className="font-bold text-[#8C8E88]">BACKEND REQUIRED</span>
                  </div>
                  <div>
                    <span className="block text-[#5C5E58] uppercase">SANITIZED INPUT</span>
                    <span className="font-bold text-[#8C8E88]">BACKEND REQUIRED</span>
                  </div>
                  <div>
                    <span className="block text-[#5C5E58] uppercase">HIDDEN REASONING</span>
                    <span className="font-bold text-[#8C8E88]">NEVER DISPLAYED</span>
                  </div>
                  <div>
                    <span className="block text-[#5C5E58] uppercase">FAILURE FALLBACK</span>
                    <span className="font-bold text-[#8C8E88]">ORIGINAL INCIDENT PRESERVED</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#242522] text-[9px] font-mono text-amber-500 font-bold uppercase" style={{ fontFamily: 'var(--font-technical)' }}>
                  AI FAILURE MUST NOT ALTER OR REMOVE THE INCIDENT REPORT.
                </div>
              </div>

            </div>
          </section>

          {/* Timeline Panel */}
          <section 
            aria-labelledby="timeline-heading"
            className="border border-[#242522] bg-[#0E0F0D] rounded-[2px] overflow-hidden flex flex-col min-h-[320px]"
          >
            {/* Panel Header */}
            <div className="border-b border-[#242522] bg-[#141513]/30 px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-[#A8AAA3]" aria-hidden="true" />
                <h3 id="timeline-heading" className="text-xs font-mono font-bold text-[#F3F1EA] tracking-wider uppercase" style={{ fontFamily: 'var(--font-technical)' }}>
                  INCIDENT TIMELINE
                </h3>
              </div>
              <div className="flex items-center gap-1.5 px-2 py-0.5 border border-amber-500/20 bg-amber-500/5 rounded-[1px] text-[8px] font-mono font-bold text-amber-500" style={{ fontFamily: 'var(--font-technical)' }}>
                <Radio className="w-2.5 h-2.5 text-amber-500 animate-pulse" />
                <span>REALTIME / NOT CONNECTED</span>
              </div>
            </div>

            {/* 1. TECHNICAL STATUS RAIL */}
            <div className="grid grid-cols-2 sm:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-[#242522] border-b border-[#242522] bg-[#0E0F0D]">
              <div className="px-4 py-2.5 text-left">
                <span className="block text-[8px] font-mono font-bold text-[#5C5E58] tracking-widest uppercase" style={{ fontFamily: 'var(--font-technical)' }}>
                  EVENT STREAM
                </span>
                <span className="text-[10px] font-mono font-bold text-amber-500 uppercase" style={{ fontFamily: 'var(--font-technical)' }}>
                  NOT CONNECTED
                </span>
              </div>
              <div className="px-4 py-2.5 text-left border-t-0">
                <span className="block text-[8px] font-mono font-bold text-[#5C5E58] tracking-widest uppercase" style={{ fontFamily: 'var(--font-technical)' }}>
                  EVENT DATA
                </span>
                <span className="text-[10px] font-mono font-bold text-[#A8AAA3] uppercase" style={{ fontFamily: 'var(--font-technical)' }}>
                  4 MOCK EVENTS
                </span>
              </div>
              <div className="px-4 py-2.5 text-left">
                <span className="block text-[8px] font-mono font-bold text-[#5C5E58] tracking-widest uppercase" style={{ fontFamily: 'var(--font-technical)' }}>
                  AUTHORITY
                </span>
                <span className="text-[10px] font-mono font-bold text-amber-500/80 uppercase" style={{ fontFamily: 'var(--font-technical)' }}>
                  BACKEND REQUIRED
                </span>
              </div>
              <div className="px-4 py-2.5 text-left">
                <span className="block text-[8px] font-mono font-bold text-[#5C5E58] tracking-widest uppercase" style={{ fontFamily: 'var(--font-technical)' }}>
                  ORDER
                </span>
                <span className="text-[10px] font-mono font-bold text-[#A8AAA3] uppercase" style={{ fontFamily: 'var(--font-technical)' }}>
                  OLDEST FIRST
                </span>
              </div>
            </div>

            {/* 2. EVENT LEDGER */}
            <div className="flex-1 bg-[#0E0F0D]">
              <div className="px-4 py-2 bg-[#141513]/10 border-b border-[#242522] flex items-center justify-between text-[9px] font-mono text-[#5C5E58]">
                <span>LEDGER STATE</span>
                <span className="font-bold text-amber-500 uppercase">FRONTEND MOCK SEQUENCE</span>
              </div>
              <ol className="divide-y divide-[#242522]" aria-label="Incident Timeline Events">
                {mockEvents.map((event) => (
                  <li key={event.sequence} className="border-b border-[#242522] last:border-b-0 bg-[#0E0F0D]/20 hover:bg-[#141513]/5 transition-colors">
                    {/* Wide Desktop Layout (>= md) */}
                    <div className="hidden md:flex items-stretch divide-x divide-[#242522] min-w-0 w-full">
                      {/* Sequence Rail */}
                      <div className="w-12 sm:w-16 flex-shrink-0 flex items-center justify-center bg-[#141513]/10 text-[#5C5E58] font-mono text-sm font-bold select-none" style={{ fontFamily: 'var(--font-technical)' }} aria-hidden="true">
                        {event.sequence}
                      </div>

                      {/* Identity & Description Area */}
                      <div className="flex-1 p-4 min-w-0 space-y-2 text-left">
                        <div className="flex flex-wrap items-center gap-3">
                          <h4 className="text-xs font-mono font-bold tracking-wider text-[#F3F1EA] uppercase" style={{ fontFamily: 'var(--font-technical)' }}>
                            {event.title}
                          </h4>
                          <span className="text-[9px] font-mono font-semibold px-1.5 py-0.5 bg-[#141513] text-[#8C8E88] rounded-[1px]" style={{ fontFamily: 'var(--font-technical)' }}>
                            {event.type}
                          </span>
                        </div>
                        <p className="text-xs text-[#A8AAA3] leading-relaxed font-sans font-normal max-w-3xl">
                          {event.sequence === '03' ? (
                            <>
                              AI assistance proposed <span className="text-red-500 font-bold">SEV1</span> severity, review flags, clarifying questions, and an immediate-action suggestion.
                            </>
                          ) : event.description}
                        </p>
                      </div>

                      {/* Compact Right-Side Region for Metadata */}
                      <div className="w-[280px] flex-shrink-0 p-4 bg-[#141513]/5 grid grid-cols-2 gap-x-4 gap-y-2.5 text-[9px] font-mono text-[#A8AAA3] text-left" style={{ fontFamily: 'var(--font-technical)' }}>
                        <div className="col-span-2 pb-1.5 border-b border-[#242522]/40 min-w-0">
                          <span className="block text-[8px] text-[#5C5E58] font-bold tracking-wider uppercase">STATE</span>
                          <span className={`text-[10px] font-bold ${event.stateColor}`}>
                            {event.state}
                          </span>
                        </div>
                        <div className="min-w-0">
                          <span className="block text-[8px] text-[#5C5E58] font-bold tracking-wider uppercase">SOURCE</span>
                          <span className="font-semibold text-[#8C8E88] block text-[9px] leading-normal animate-fade-in" style={{ fontFamily: 'var(--font-technical)', whiteSpace: 'normal', overflowWrap: 'anywhere', wordBreak: 'normal' }}>{event.source}</span>
                        </div>
                        <div className="min-w-0">
                          <span className="block text-[8px] text-[#5C5E58] font-bold tracking-wider uppercase">ACTOR</span>
                          <span className="font-semibold text-[#8C8E88] block text-[9px] leading-normal animate-fade-in" style={{ fontFamily: 'var(--font-technical)', whiteSpace: 'normal', overflowWrap: 'anywhere', wordBreak: 'normal' }}>{event.actor}</span>
                        </div>
                        <div className="min-w-0">
                          <span className="block text-[8px] text-[#5C5E58] font-bold tracking-wider uppercase">TIME</span>
                          <span className="font-semibold text-[#8C8E88] block text-[9px] leading-normal" style={{ fontFamily: 'var(--font-technical)', whiteSpace: 'normal', overflowWrap: 'anywhere', wordBreak: 'normal' }}>{event.time}</span>
                        </div>
                        <div className="min-w-0">
                          <span className="block text-[8px] text-[#5C5E58] font-bold tracking-wider uppercase">PERSISTENCE</span>
                          <span className="font-semibold text-amber-500 block text-[9px] leading-normal" style={{ fontFamily: 'var(--font-technical)', whiteSpace: 'normal', overflowWrap: 'anywhere', wordBreak: 'normal' }}>{event.persistence}</span>
                        </div>
                      </div>
                    </div>

                    {/* Constrained Layout (< md) */}
                    <div className="md:hidden p-4 space-y-3.5 min-w-0 w-full text-left">
                      {/* Level 1: Sequence + Event Title + State */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-[#242522]/50">
                        <div className="flex items-center gap-2.5">
                          <span className="text-xs font-mono font-bold text-[#5C5E58] bg-[#141513] px-1.5 py-0.5 rounded-[1px]" style={{ fontFamily: 'var(--font-technical)' }} aria-hidden="true">
                            {event.sequence}
                          </span>
                          <h4 className="text-xs font-mono font-bold tracking-wider text-[#F3F1EA] uppercase" style={{ fontFamily: 'var(--font-technical)' }}>
                            {event.title}
                          </h4>
                        </div>
                        <div className="text-[10px] font-mono flex items-center gap-1.5" style={{ fontFamily: 'var(--font-technical)' }}>
                          <span className="text-[#5C5E58] font-bold uppercase text-[8px] tracking-wider">STATE:</span>
                          <span className={`font-bold ${event.stateColor}`}>
                            {event.state}
                          </span>
                        </div>
                      </div>

                      {/* Level 2: Description + Metadata fields */}
                      <div className="space-y-3">
                        <p className="text-xs text-[#A8AAA3] leading-relaxed font-sans font-normal">
                          {event.sequence === '03' ? (
                            <>
                              AI assistance proposed <span className="text-red-500 font-bold">SEV1</span> severity, review flags, clarifying questions, and an immediate-action suggestion.
                            </>
                          ) : event.description}
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2.5 border-t border-[#242522]/30 text-[9px] font-mono text-[#A8AAA3]" style={{ fontFamily: 'var(--font-technical)' }}>
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between sm:gap-2 border-b border-[#242522]/30 sm:border-b-0 pb-1.5 sm:pb-0">
                            <span className="text-[#5C5E58] font-bold tracking-wider uppercase text-[8px] mb-0.5 sm:mb-0">EVENT TYPE</span>
                            <span className="font-semibold text-[#8C8E88] bg-[#141513] px-1.5 py-0.5 rounded-[1px]">{event.type}</span>
                          </div>
                          
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between sm:gap-2 border-b border-[#242522]/30 sm:border-b-0 pb-1.5 sm:pb-0">
                            <span className="text-[#5C5E58] font-bold tracking-wider uppercase text-[8px] mb-0.5 sm:mb-0">SOURCE</span>
                            <span className="font-semibold text-[#8C8E88] text-right">{event.source}</span>
                          </div>

                          <div className="flex flex-col sm:flex-row sm:items-center justify-between sm:gap-2 border-b border-[#242522]/30 sm:border-b-0 pb-1.5 sm:pb-0">
                            <span className="text-[#5C5E58] font-bold tracking-wider uppercase text-[8px] mb-0.5 sm:mb-0">ACTOR</span>
                            <span className="font-semibold text-[#8C8E88] text-right">{event.actor}</span>
                          </div>

                          <div className="flex flex-col sm:flex-row sm:items-center justify-between sm:gap-2 border-b border-[#242522]/30 sm:border-b-0 pb-1.5 sm:pb-0">
                            <span className="text-[#5C5E58] font-bold tracking-wider uppercase text-[8px] mb-0.5 sm:mb-0">TIME</span>
                            <span className="font-semibold text-[#8C8E88] text-right">{event.time}</span>
                          </div>

                          <div className="col-span-1 sm:col-span-2 flex flex-col sm:flex-row sm:items-center justify-between sm:gap-2 pt-1 sm:pt-0">
                            <span className="text-[#5C5E58] font-bold tracking-wider uppercase text-[8px] mb-0.5 sm:mb-0">PERSISTENCE</span>
                            <span className="font-semibold text-amber-500 text-right">{event.persistence}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            {/* APPEND-ONLY NOTICE */}
            <div className="border-t border-[#242522] bg-[#141513]/5 p-4 space-y-2 w-full text-left">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="space-y-0.5">
                  <span className="block text-[8px] font-mono font-bold text-[#5C5E58] tracking-widest uppercase" style={{ fontFamily: 'var(--font-technical)' }}>
                    TIMELINE CONTRACT
                  </span>
                  <h5 className="text-[10px] font-mono font-bold text-[#F3F1EA] uppercase tracking-wider" style={{ fontFamily: 'var(--font-technical)' }}>
                    APPEND-ONLY EVENT HISTORY
                  </h5>
                </div>
                <div className="flex flex-col text-left sm:text-right" style={{ fontFamily: 'var(--font-technical)' }}>
                  <span className="block text-[8px] font-mono font-bold text-[#5C5E58] tracking-widest uppercase">
                    SERVER AUTHORITY
                  </span>
                  <span className="text-[9px] font-mono font-bold text-amber-500 uppercase">
                    NOT CONNECTED
                  </span>
                </div>
              </div>
              <p className="text-[11px] text-[#8C8E88] leading-relaxed">
                During backend integration, authoritative incident actions will append immutable timeline records rather than rewriting prior operational history.
              </p>
            </div>

            {/* 3. EVENT-SCOPE FOOTER */}
            <div className="border-t border-[#242522] bg-[#141513]/10 p-4 space-y-2 mt-auto w-full">
              <span className="block text-[8px] font-mono font-bold text-[#5C5E58] tracking-widest uppercase" style={{ fontFamily: 'var(--font-technical)' }}>
                SUPPORTED EVENT SCOPE
              </span>
              <div className="flex flex-wrap gap-2 text-[9px] font-mono text-[#A8AAA3]" style={{ fontFamily: 'var(--font-technical)' }}>
                {['INCIDENT', 'STATUS', 'SEVERITY', 'TASK', 'NOTE', 'RESOLUTION'].map((cat) => (
                  <span key={cat} className="px-2 py-0.5 bg-[#0E0F0D] border border-[#242522] text-[#8C8E88] rounded-[1px] font-bold">
                    {cat}
                  </span>
                ))}
              </div>
            </div>
          </section>
        </main>

        {/* RIGHT OPERATIONAL RAIL */}
        {/* On mobile, this rail's content splits into 'TASKS' tab or 'DETAILS' tab */}
        <aside 
          className={`operational-rail min-w-0 w-full max-w-full min-[1000px]:flex min-[1000px]:flex-col min-[1000px]:gap-6 min-[1000px]:space-y-0 space-y-6 min-[1100px]:sticky min-[1100px]:top-6 h-fit ${
            activeTab !== 'TIMELINE' ? 'block' : 'hidden min-[1000px]:flex'
          }`}
        >
          {/* Section 1: Response Tasks Panel */}
          <section 
            id="panel-TASKS"
            role="tabpanel"
            aria-labelledby="response-tasks-heading"
            className={`border border-[#242522] bg-[#0E0F0D] rounded-[2px] w-full max-w-full min-[1000px]:block flex flex-col ${
              activeTab === 'TASKS' ? 'block' : 'hidden'
            }`}
          >
            {isDesktop ? (
              <div className="flex flex-col w-full text-left">
                {/* Header Title Bar */}
                <div className="border-b border-[#242522] bg-[#141513]/30 px-4 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ListTodo className="w-4 h-4 text-[#5C5E58]" aria-hidden="true" />
                    <h3 id="response-tasks-heading" className="text-xs font-mono font-bold text-[#F3F1EA] tracking-wider uppercase" style={{ fontFamily: 'var(--font-technical)' }}>
                      RESPONSE TASKS
                    </h3>
                  </div>
                  <span className="text-[8px] px-1.5 py-0.5 bg-[#242522] text-[#A8AAA3] rounded-[1px] font-mono font-bold" style={{ fontFamily: 'var(--font-technical)' }}>
                    5 SUGGESTIONS
                  </span>
                </div>

                {/* Sub-rail Metrics */}
                <div className="grid grid-cols-2 divide-x divide-[#242522] border-b border-[#242522] bg-[#0E0F0D]">
                  <div className="px-4 py-2.5 text-left">
                    <span className="block text-[8px] font-mono font-bold text-[#5C5E58] tracking-widest uppercase" style={{ fontFamily: 'var(--font-technical)' }}>
                      RECOMMENDATIONS
                    </span>
                    <span className="text-[10px] font-mono font-bold text-[#F3F1EA] uppercase" style={{ fontFamily: 'var(--font-technical)' }}>
                      5 SUGGESTED
                    </span>
                  </div>
                  <div className="px-4 py-2.5 text-left">
                    <span className="block text-[8px] font-mono font-bold text-[#5C5E58] tracking-widest uppercase" style={{ fontFamily: 'var(--font-technical)' }}>
                      LOCAL PREVIEWS
                    </span>
                    <span className="text-[10px] font-mono font-bold text-amber-500 uppercase" style={{ fontFamily: 'var(--font-technical)' }}>
                      {localPreviews.length} ACTIVE
                    </span>
                  </div>
                </div>

                {/* Main operational summary info */}
                <div className="p-4 space-y-3.5 border-b border-[#242522] bg-[#141513]/5">
                  <div className="space-y-1">
                    <span className="block text-[8px] font-mono font-bold text-amber-500 tracking-wider uppercase" style={{ fontFamily: 'var(--font-technical)' }}>
                      FRONTEND PREVIEW ONLY
                    </span>
                    <p className="text-[11px] text-[#A8AAA3] leading-relaxed">
                      This incident is in a frontend-only verification state. Task actions are local and non-authoritative.
                    </p>
                  </div>

                  {/* List of the 5 suggested task titles in compact list */}
                  <div className="space-y-2 pt-1">
                    <span className="block text-[8px] font-mono font-bold text-[#5C5E58] tracking-widest uppercase" style={{ fontFamily: 'var(--font-technical)' }}>
                      SUGGESTIONS LIST
                    </span>
                    <div className="divide-y divide-[#242522]/50 font-mono text-[10px]" style={{ fontFamily: 'var(--font-technical)' }}>
                      {[
                        { id: '01', text: 'COMPARE LATEST DEPLOYMENT CHANGES' },
                        { id: '02', text: 'CONFIRM PAYMENT GATEWAY HEALTH' },
                        { id: '03', text: 'RUN CHECKOUT TRANSACTION TEST' },
                        { id: '04', text: 'PREPARE ROLLBACK' },
                        { id: '05', text: 'DRAFT CUSTOMER-FACING STATUS UPDATE' }
                      ].map((task) => {
                        const hasPreview = localPreviews.some(p => p.sequence === task.id);
                        return (
                          <div key={task.id} className="py-2 first:pt-0 last:pb-0 flex items-center justify-between gap-2 min-w-0">
                            <div className="flex items-center gap-2 min-w-0">
                              <span className="text-[#5C5E58] font-bold shrink-0">{task.id}</span>
                              <span className="text-[#F3F1EA] font-semibold truncate uppercase" title={task.text}>{task.text}</span>
                            </div>
                            <span className={`text-[8px] font-bold shrink-0 px-1 rounded-[1px] ${
                              hasPreview ? 'bg-amber-500/10 border border-amber-500/20 text-amber-500' : 'bg-[#141513] border border-[#242522] text-[#5C5E58]'
                            }`}>
                              {hasPreview ? 'PREVIEW' : 'SUGGESTION'}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Primary CTA button to open full workspace drawer */}
                <div className="p-4 bg-[#141513]/10">
                  <button
                    id="open-task-workspace"
                    type="button"
                    onClick={openWorkspaceDrawer}
                    className="w-full py-2.5 px-4 bg-[#141513] hover:bg-[#D6FF3F]/10 border border-[#242522] hover:border-[#D6FF3F]/50 text-xs font-mono font-bold tracking-wider text-[#F3F1EA] hover:text-[#D6FF3F] rounded-[1px] transition-all cursor-pointer flex items-center justify-center gap-2 uppercase"
                    style={{ fontFamily: 'var(--font-technical)' }}
                  >
                    <ListTodo className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                    <span>OPEN TASK WORKSPACE</span>
                  </button>
                  <p className="text-[9px] font-mono text-[#5C5E58] text-center mt-2 uppercase" style={{ fontFamily: 'var(--font-technical)' }}>
                    DRAWER WIDTH: 720PX (PRACTICAL DENSITY)
                  </p>
                </div>
              </div>
            ) : (
              renderFullTaskWorkspace(false)
            )}
          </section>

          {/* Section 2: Responders Panel */}
          <div 
            id="panel-RESPONDERS"
            className={`border border-[#242522] bg-[#0E0F0D] rounded-[2px] w-full max-w-full min-[1000px]:block ${
              activeTab === 'DETAILS' ? 'block' : 'hidden'
            }`}
          >
            {/* 1. PANEL HEADER */}
            <div className="border-b border-[#242522] bg-[#141513]/30 px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-[#5C5E58]" aria-hidden="true" />
                <h3 className="text-xs font-mono font-bold text-[#F3F1EA] tracking-wider uppercase" style={{ fontFamily: 'var(--font-technical)' }}>
                  RESPONDERS
                </h3>
              </div>
            </div>

            {/* Header Metadata Sub-rail */}
            <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-[#242522] border-b border-[#242522] bg-[#0E0F0D]">
              <div className="px-4 py-2 text-left">
                <span className="block text-[8px] font-mono font-bold text-[#5C5E58] tracking-widest uppercase" style={{ fontFamily: 'var(--font-technical)' }}>
                  COMMANDER
                </span>
                <span className="text-[10px] font-mono font-bold text-amber-500 uppercase" style={{ fontFamily: 'var(--font-technical)' }}>
                  UNASSIGNED
                </span>
              </div>
              <div className="px-4 py-2 text-left">
                <span className="block text-[8px] font-mono font-bold text-[#5C5E58] tracking-widest uppercase" style={{ fontFamily: 'var(--font-technical)' }}>
                  MEMBER DATA
                </span>
                <span className="text-[10px] font-mono font-bold text-[#8C8E88] uppercase" style={{ fontFamily: 'var(--font-technical)' }}>
                  NOT LOADED
                </span>
              </div>
              <div className="px-4 py-2 text-left">
                <span className="block text-[8px] font-mono font-bold text-[#5C5E58] tracking-widest uppercase" style={{ fontFamily: 'var(--font-technical)' }}>
                  COORDINATION
                </span>
                <span className="text-[10px] font-mono font-bold text-amber-500 uppercase" style={{ fontFamily: 'var(--font-technical)' }}>
                  AWAITING AUTHORITY
                </span>
              </div>
            </div>

            {/* COMMANDER SUMMARY */}
            <div className="p-4 border-b border-[#242522] space-y-2 text-left">
              <span className="block text-[8px] font-mono font-bold text-[#5C5E58] tracking-widest uppercase" style={{ fontFamily: 'var(--font-technical)' }}>
                INCIDENT COMMANDER
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[10px] font-mono" style={{ fontFamily: 'var(--font-technical)' }}>
                <div>
                  <span className="block text-[8px] text-[#5C5E58] font-bold tracking-wider uppercase">CURRENT STATE</span>
                  <span className="font-semibold text-amber-500 block truncate">UNASSIGNED</span>
                </div>
                <div>
                  <span className="block text-[8px] text-[#5C5E58] font-bold tracking-wider uppercase">AUTHORITY</span>
                  <span className="font-semibold text-[#8C8E88] block">INCIDENT MANAGER OR ADMIN REQUIRED</span>
                </div>
                <div>
                  <span className="block text-[8px] text-[#5C5E58] font-bold tracking-wider uppercase">MEMBERSHIP</span>
                  <span className="font-semibold text-[#8C8E88] block">NOT VERIFIED</span>
                </div>
              </div>
              <p className="text-[11px] text-[#A8AAA3] leading-relaxed font-sans font-normal">
                An authorized active organization member is required before incident command can be assigned.
              </p>
            </div>

            {/* CURRENT OPERATOR SUMMARY */}
            <div className="p-4 border-b border-[#242522] space-y-2 text-left">
              <span className="block text-[8px] font-mono font-bold text-[#5C5E58] tracking-widest uppercase" style={{ fontFamily: 'var(--font-technical)' }}>
                CURRENT OPERATOR
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[10px] font-mono" style={{ fontFamily: 'var(--font-technical)' }}>
                <div>
                  <span className="block text-[8px] text-[#5C5E58] font-bold tracking-wider uppercase">IDENTITY</span>
                  <span className="font-semibold text-[#8C8E88] block truncate">FRONTEND PREVIEW</span>
                </div>
                <div>
                  <span className="block text-[8px] text-[#5C5E58] font-bold tracking-wider uppercase">OPERATING ROLE</span>
                  <span className="font-semibold text-[#8C8E88] block truncate">NOT LOADED</span>
                </div>
                <div className="col-span-1 sm:col-span-2">
                  <span className="block text-[8px] text-[#5C5E58] font-bold tracking-wider uppercase">COMMANDER ELIGIBILITY</span>
                  <span className="font-semibold text-[#8C8E88] block truncate">NOT DETERMINED</span>
                </div>
              </div>
            </div>

            {/* RESPONDER DIRECTORY SUMMARY */}
            <div className="p-4 border-b border-[#242522] space-y-2 text-left">
              <span className="block text-[8px] font-mono font-bold text-[#5C5E58] tracking-widest uppercase" style={{ fontFamily: 'var(--font-technical)' }}>
                RESPONDER DIRECTORY
              </span>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-[10px] font-mono" style={{ fontFamily: 'var(--font-technical)' }}>
                  <span className="text-[8px] text-[#5C5E58] font-bold tracking-wider uppercase">STATE</span>
                  <span className="font-semibold text-[#8C8E88] block">MEMBERSHIP DATA NOT LOADED</span>
                </div>
                <p className="text-[11px] text-[#A8AAA3] leading-relaxed font-sans font-normal">
                  Active organization members will appear after authenticated membership data is connected.
                </p>
              </div>
            </div>

            {/* ACTIONS */}
            <div className="p-4 space-y-3 text-left">
              <div className="space-y-2">
                <button
                  id="view-responder-context"
                  onClick={openContextDrawer}
                  className="w-full py-2.5 px-4 border border-[#242522] bg-[#141513]/20 hover:bg-[#D6FF3F]/10 hover:border-[#D6FF3F]/40 text-[10px] font-mono font-bold text-[#F3F1EA] hover:text-[#D6FF3F] rounded-[1px] cursor-pointer uppercase text-center transition-colors"
                  style={{ fontFamily: 'var(--font-technical)' }}
                >
                  VIEW RESPONDER CONTEXT
                </button>

                <button
                  id="assign-incident-commander"
                  disabled
                  aria-disabled="true"
                  className="w-full py-2.5 px-4 border border-[#242522] bg-[#141513]/10 text-[10px] font-mono font-bold text-[#5C5E58] rounded-[1px] cursor-not-allowed uppercase text-center"
                  style={{ fontFamily: 'var(--font-technical)' }}
                >
                  ASSIGN INCIDENT COMMANDER
                </button>
                <div className="flex items-center justify-between text-[8px] font-mono text-[#5C5E58]" style={{ fontFamily: 'var(--font-technical)' }}>
                  <span>STATUS</span>
                  <span className="text-amber-500 font-bold uppercase">BACKEND AUTHORITY REQUIRED</span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Incident Metadata Placeholder */}
          <div 
            id="panel-DETAILS"
            role="tabpanel"
            aria-labelledby="tab-DETAILS"
            className={`border border-[#242522] bg-[#0E0F0D] rounded-[2px] w-full max-w-full min-[1000px]:block ${
              activeTab === 'DETAILS' ? 'block' : 'hidden'
            }`}
          >
            <div className="border-b border-[#242522] bg-[#141513]/30 px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-[#5C5E58]" aria-hidden="true" />
                <h3 className="text-xs font-mono font-bold text-[#F3F1EA] tracking-wider uppercase" style={{ fontFamily: 'var(--font-technical)' }}>
                  INCIDENT METADATA
                </h3>
              </div>
            </div>

            <div className="p-5 text-left space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="block text-[8px] text-[#5C5E58] font-bold uppercase tracking-widest" style={{ fontFamily: 'var(--font-technical)' }}>
                    ORGANIZATION
                  </span>
                  <span className="text-xs font-mono font-bold text-[#F3F1EA]" style={{ fontFamily: 'var(--font-technical)' }}>
                    NORTHSTAR COMMERCE
                  </span>
                </div>
                <div>
                  <span className="block text-[8px] text-[#5C5E58] font-bold uppercase tracking-widest" style={{ fontFamily: 'var(--font-technical)' }}>
                    SERVICE
                  </span>
                  <span className="text-xs font-mono font-bold text-[#F3F1EA]" style={{ fontFamily: 'var(--font-technical)' }}>
                    PAYMENTS API
                  </span>
                </div>
                <div>
                  <span className="block text-[8px] text-[#5C5E58] font-bold uppercase tracking-widest" style={{ fontFamily: 'var(--font-technical)' }}>
                    RECORD STATE
                  </span>
                  <span className="text-xs font-mono font-bold text-amber-500 uppercase" style={{ fontFamily: 'var(--font-technical)' }}>
                    FRONTEND MOCK
                  </span>
                </div>
                <div>
                  <span className="block text-[8px] text-[#5C5E58] font-bold uppercase tracking-widest" style={{ fontFamily: 'var(--font-technical)' }}>
                    AUTHORITY
                  </span>
                  <span className="text-xs font-mono font-bold text-[#5C5E58] uppercase" style={{ fontFamily: 'var(--font-technical)' }}>
                    BACKEND REQUIRED
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t border-[#242522] text-[10px] font-mono text-[#5C5E58]" style={{ fontFamily: 'var(--font-technical)' }}>
                System authority context matches local seed specification.
              </div>
            </div>
          </div>
        </aside>

      </div>

      {/* 5. BOTTOM SYSTEM RAIL (Amber/neutral pending styling) */}
      <footer 
        id="bottom-system-rail"
        className="border border-[#242522]/80 bg-[#0E0F0D] p-3 rounded-[2px] grid grid-cols-1 sm:grid-cols-3 items-center justify-between gap-4 text-xs font-mono text-[#5C5E58]"
        style={{ fontFamily: 'var(--font-technical)' }}
      >
        <div className="flex items-center gap-2 justify-center sm:justify-start">
          <Network className="w-3.5 h-3.5 text-[#5C5E58]" aria-hidden="true" />
          <span className="font-bold tracking-wider uppercase">SIGNALFOLD / INCIDENT COMMAND</span>
        </div>
        
        <div className="text-center">
          <span className="bg-[#141513] border border-[#242522] px-2 py-0.5 rounded-[1px] text-[#A8AAA3] font-bold">
            INCIDENT RECORD / FRONTEND MOCK
          </span>
        </div>

        <div className="flex items-center gap-2 justify-center sm:justify-end text-amber-600">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-600 animate-pulse" />
          <span className="font-bold uppercase">REALTIME CONNECTION / NOT ACTIVE</span>
        </div>
      </footer>

      {/* Responder Context Drawer */}
      {isContextDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Overlay */}
          <div 
            onClick={closeContextDrawer}
            className="fixed inset-0 bg-black/60 backdrop-blur-[1px] transition-opacity duration-200"
            aria-hidden="true"
          />
          
          {/* Drawer container */}
          <div 
            ref={contextDrawerRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="responder-context-title"
            className="relative w-full sm:w-[520px] h-full bg-[#0E0F0D] border-l border-[#242522] flex flex-col shadow-2xl z-10 rounded-none overflow-hidden text-left"
          >
            {/* Header */}
            <div className="border-b border-[#242522] bg-[#141513]/30 px-6 py-4 flex items-center justify-between">
              <div className="text-left">
                <h2 id="responder-context-title" className="text-xs font-mono font-bold text-[#F3F1EA] tracking-wider uppercase" style={{ fontFamily: 'var(--font-technical)' }}>
                  RESPONDER CONTEXT
                </h2>
                <span className="text-[9px] font-mono font-bold text-[#5C5E58] tracking-widest uppercase block mt-0.5" style={{ fontFamily: 'var(--font-technical)' }}>
                  ORGANIZATION READINESS / SYSTEM STATE
                </span>
              </div>
              <button
                onClick={closeContextDrawer}
                aria-label="Close responder context"
                className="p-1.5 border border-[#242522] hover:bg-[#141513] text-[#8C8E88] hover:text-[#F3F1EA] rounded-[1px] transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Scrollable content area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              
              {/* SECTION 1: MEMBERSHIP READINESS */}
              <section className="space-y-3">
                <div className="flex items-center gap-2 border-b border-[#242522] pb-1.5">
                  <span className="text-[#5C5E58] font-mono font-bold text-[8px] tracking-widest uppercase" style={{ fontFamily: 'var(--font-technical)' }}>
                    01. MEMBERSHIP READINESS
                  </span>
                </div>
                
                <div className="grid grid-cols-1 gap-2.5 text-[10px] font-mono" style={{ fontFamily: 'var(--font-technical)' }}>
                  <div className="flex items-center justify-between border-b border-[#242522]/20 pb-1">
                    <span className="text-[#5C5E58] font-bold uppercase">AUTHENTICATED USER</span>
                    <span className="font-semibold text-amber-500 uppercase">BACKEND REQUIRED / NOT ACTIVE</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-[#242522]/20 pb-1">
                    <span className="text-[#5C5E58] font-bold uppercase">ACTIVE ORGANIZATION MEMBERSHIP</span>
                    <span className="font-semibold text-amber-500 uppercase">BACKEND REQUIRED / NOT LOADED</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-[#242522]/20 pb-1">
                    <span className="text-[#5C5E58] font-bold uppercase">ROLE VERIFICATION</span>
                    <span className="font-semibold text-amber-500 uppercase">BACKEND REQUIRED / NOT VERIFIED</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-[#242522]/20 pb-1">
                    <span className="text-[#5C5E58] font-bold uppercase">COMMANDER ELIGIBILITY</span>
                    <span className="font-semibold text-amber-500 uppercase">BACKEND REQUIRED / NOT DETERMINED</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-[#242522]/20 pb-1">
                    <span className="text-[#5C5E58] font-bold uppercase">RESPONDER DIRECTORY</span>
                    <span className="font-semibold text-[#8C8E88] uppercase">NOT LOADED</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-[#242522]/20 pb-1">
                    <span className="text-[#5C5E58] font-bold uppercase">REALTIME PRESENCE</span>
                    <span className="font-semibold text-[#8C8E88] uppercase">NOT CONNECTED</span>
                  </div>
                </div>
                
                <p className="text-[11px] text-[#A8AAA3] leading-relaxed">
                  Active connection to database authorities, organization directory access, and security policies are required to confirm responder readiness.
                </p>
              </section>

              {/* SECTION 2: ROLE AUTHORITY REFERENCE */}
              <section className="space-y-3">
                <div className="flex items-center gap-2 border-b border-[#242522] pb-1.5">
                  <span className="text-[#5C5E58] font-mono font-bold text-[8px] tracking-widest uppercase" style={{ fontFamily: 'var(--font-technical)' }}>
                    02. ROLE AUTHORITY REFERENCE
                  </span>
                </div>
                
                <div className="space-y-3">
                  <div className="space-y-1">
                    <span className="block text-[10px] font-mono font-bold text-[#F3F1EA]" style={{ fontFamily: 'var(--font-technical)' }}>
                      REPORTER
                    </span>
                    <p className="text-[11px] text-[#A8AAA3] leading-relaxed font-sans font-normal">
                      Can report incidents and add context. Cannot set final severity or resolve the incident.
                    </p>
                  </div>
                  <div className="space-y-1">
                    <span className="block text-[10px] font-mono font-bold text-[#F3F1EA]" style={{ fontFamily: 'var(--font-technical)' }}>
                      RESPONDER
                    </span>
                    <p className="text-[11px] text-[#A8AAA3] leading-relaxed font-sans font-normal">
                      Can coordinate response work and manage authorized task activity. Cannot become commander unless role authority permits.
                    </p>
                  </div>
                  <div className="space-y-1">
                    <span className="block text-[10px] font-mono font-bold text-[#F3F1EA]" style={{ fontFamily: 'var(--font-technical)' }}>
                      INCIDENT MANAGER
                    </span>
                    <p className="text-[11px] text-[#A8AAA3] leading-relaxed font-sans font-normal">
                      Can control severity, status, ownership, resolution, and commander assignment.
                    </p>
                  </div>
                  <div className="space-y-1">
                    <span className="block text-[10px] font-mono font-bold text-[#F3F1EA]" style={{ fontFamily: 'var(--font-technical)' }}>
                      ORGANIZATION ADMIN
                    </span>
                    <p className="text-[11px] text-[#A8AAA3] leading-relaxed font-sans font-normal">
                      Can manage organization membership and has incident-management authority where permitted.
                    </p>
                  </div>
                </div>
              </section>

              {/* SECTION 3: DIRECTORY SCHEMA */}
              <section className="space-y-3">
                <div className="flex items-center gap-2 border-b border-[#242522] pb-1.5">
                  <span className="text-[#5C5E58] font-mono font-bold text-[8px] tracking-widest uppercase" style={{ fontFamily: 'var(--font-technical)' }}>
                    03. DIRECTORY SCHEMA
                  </span>
                </div>
                
                <p className="text-[11px] text-[#A8AAA3] leading-relaxed">
                  Real organizational directory data is validated against the following record parameters when loaded:
                </p>

                <div className="border border-[#242522] bg-[#141513]/10 p-4 rounded-[1px] space-y-3 text-[10px] font-mono" style={{ fontFamily: 'var(--font-technical)' }}>
                  <div className="flex items-center justify-between border-b border-[#242522]/30 pb-1">
                    <span className="text-[#5C5E58] font-bold uppercase">SCHEMA VERIFICATION</span>
                    <span className="text-amber-500 font-bold uppercase">MEMBERSHIP DATA NOT LOADED</span>
                  </div>

                  <div className="grid grid-cols-2 gap-x-4 gap-y-3 pt-1">
                    <div>
                      <span className="block text-[8px] text-[#5C5E58] font-bold uppercase">MEMBER</span>
                      <span className="text-[#8C8E88] font-semibold block truncate">NOT AVAILABLE</span>
                    </div>
                    <div>
                      <span className="block text-[8px] text-[#5C5E58] font-bold uppercase">ROLE</span>
                      <span className="text-[#8C8E88] font-semibold block truncate">NOT AVAILABLE</span>
                    </div>
                    <div>
                      <span className="block text-[8px] text-[#5C5E58] font-bold uppercase">INCIDENT PARTICIPATION</span>
                      <span className="text-[#8C8E88] font-semibold block truncate">NOT AVAILABLE</span>
                    </div>
                    <div>
                      <span className="block text-[8px] text-[#5C5E58] font-bold uppercase">PRESENCE</span>
                      <span className="text-[#8C8E88] font-semibold block truncate">NOT CONNECTED</span>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-amber-500/10 border border-amber-500/20 text-[10px] text-amber-500 font-mono leading-relaxed rounded-[1px]">
                  <span className="font-bold block mb-0.5">NOTICE: DIRECTORY VERIFICATION ACTIVE</span>
                  DO NOT GENERATE FAKE DIRECTORY RECORDS. Active responder profiles require authorized backend authentication and synchronization keys.
                </div>
              </section>

              {/* SECTION 4: PARTICIPATION CONTRACT */}
              <section className="space-y-3">
                <div className="flex items-center gap-2 border-b border-[#242522] pb-1.5">
                  <span className="text-[#5C5E58] font-mono font-bold text-[8px] tracking-widest uppercase" style={{ fontFamily: 'var(--font-technical)' }}>
                    04. PARTICIPATION CONTRACT
                  </span>
                </div>
                
                <div className="grid grid-cols-1 gap-2.5 text-[10px] font-mono text-[#A8AAA3]" style={{ fontFamily: 'var(--font-technical)' }}>
                  <div className="flex items-center justify-between border-b border-[#242522]/20 pb-1">
                    <span className="text-[#5C5E58] font-bold uppercase">ORGANIZATION ACCESS</span>
                    <span className="font-semibold text-amber-500 uppercase">ACTIVE MEMBERSHIP REQUIRED</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-[#242522]/20 pb-1">
                    <span className="text-[#5C5E58] font-bold uppercase">COMMANDER ROLE</span>
                    <span className="font-semibold text-[#8C8E88] uppercase">INCIDENT MANAGER OR ADMIN</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-[#242522]/20 pb-1">
                    <span className="text-[#5C5E58] font-bold uppercase">TASK ASSIGNEE</span>
                    <span className="font-semibold text-amber-500 uppercase">ACTIVE MEMBER REQUIRED</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-[#242522]/20 pb-1">
                    <span className="text-[#5C5E58] font-bold uppercase">CLAIM SAFETY</span>
                    <span className="font-semibold text-[#8C8E88] uppercase">SERVER CONTROLLED</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-[#242522]/20 pb-1">
                    <span className="text-[#5C5E58] font-bold uppercase">PRESENCE</span>
                    <span className="font-semibold text-amber-500 uppercase">REALTIME SUBSCRIPTION REQUIRED</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-[#242522]/20 pb-1">
                    <span className="text-[#5C5E58] font-bold uppercase">AUDIT EVENT</span>
                    <span className="font-semibold text-[#8C8E88] uppercase">SERVER GENERATED</span>
                  </div>
                </div>

                <div className="pt-2 space-y-2">
                  <span className="block text-[8px] font-mono font-bold text-red-500 tracking-wider uppercase" style={{ fontFamily: 'var(--font-technical)' }}>
                    FRONTEND VISIBILITY IS NOT PERMISSION ENFORCEMENT.
                  </span>
                  <p className="text-[11px] text-[#8C8E88] leading-relaxed">
                    Backend security rules must verify tenant membership and operational authority before any responder, commander, or task ownership change is accepted.
                  </p>
                </div>
              </section>

            </div>

            {/* Sticky bottom close panel */}
            <div className="border-t border-[#242522] bg-[#141513]/10 p-6 flex justify-end">
              <button
                onClick={closeContextDrawer}
                className="w-full sm:w-auto py-2.5 px-6 border border-[#242522] hover:bg-[#141513] text-xs font-mono font-bold text-[#F3F1EA] rounded-[1px] cursor-pointer transition-colors uppercase text-center"
              >
                DISMISS
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Task Review Drawer */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Overlay */}
          <div 
            onClick={closeDrawer}
            className="fixed inset-0 bg-black/60 backdrop-blur-[1px] transition-opacity duration-200"
            aria-hidden="true"
          />
          
          {/* Drawer container */}
          <div 
            ref={drawerRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="task-review-title"
            className="relative w-full sm:w-[480px] h-full bg-[#0E0F0D] border-l border-[#242522] flex flex-col shadow-2xl z-10 rounded-none overflow-hidden"
          >
            {/* Header */}
            <div className="border-b border-[#242522] bg-[#141513]/30 px-6 py-4 flex items-center justify-between">
              <div className="text-left">
                <h2 id="task-review-title" className="text-xs font-mono font-bold text-[#F3F1EA] tracking-wider uppercase" style={{ fontFamily: 'var(--font-technical)' }}>
                  TASK REVIEW
                </h2>
                <span className="text-[9px] font-mono font-bold text-[#5C5E58] tracking-widest uppercase block mt-0.5" style={{ fontFamily: 'var(--font-technical)' }}>
                  AI SUGGESTION / FRONTEND PREVIEW
                </span>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <span className="block text-[8px] font-mono font-bold text-[#5C5E58] tracking-widest uppercase" style={{ fontFamily: 'var(--font-technical)' }}>
                    RECORD
                  </span>
                  <span className="text-[10px] font-mono font-bold text-amber-500 uppercase" style={{ fontFamily: 'var(--font-technical)' }}>
                    NOT CREATED
                  </span>
                </div>
                <button
                  onClick={closeDrawer}
                  aria-label="Close task review"
                  className="p-1.5 text-[#A8AAA3] hover:text-[#D6FF3F] hover:bg-[#141513] border border-transparent hover:border-[#242522] rounded-[1px] transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Task Identity info */}
            <div className="grid grid-cols-2 gap-x-4 gap-y-3 p-6 bg-[#141513]/10 border-b border-[#242522] text-left">
              <div>
                <span className="block text-[8px] font-mono font-bold text-[#5C5E58] tracking-widest uppercase" style={{ fontFamily: 'var(--font-technical)' }}>
                  SUGGESTION
                </span>
                <span className="text-xs font-mono font-bold text-[#F3F1EA] uppercase" style={{ fontFamily: 'var(--font-technical)' }}>
                  {selectedTask?.sequence}
                </span>
              </div>
              <div>
                <span className="block text-[8px] font-mono font-bold text-[#5C5E58] tracking-widest uppercase" style={{ fontFamily: 'var(--font-technical)' }}>
                  INCIDENT
                </span>
                <span className="text-xs font-mono font-bold text-[#F3F1EA] uppercase" style={{ fontFamily: 'var(--font-technical)' }}>
                  SF-2026-0042
                </span>
              </div>
              <div>
                <span className="block text-[8px] font-mono font-bold text-[#5C5E58] tracking-widest uppercase" style={{ fontFamily: 'var(--font-technical)' }}>
                  SOURCE
                </span>
                <span className="text-xs font-mono font-bold text-[#F3F1EA] uppercase" style={{ fontFamily: 'var(--font-technical)' }}>
                  AI TRIAGE PREVIEW
                </span>
              </div>
              <div>
                <span className="block text-[8px] font-mono font-bold text-[#5C5E58] tracking-widest uppercase" style={{ fontFamily: 'var(--font-technical)' }}>
                  SUGGESTION STATE
                </span>
                <span className="text-xs font-mono font-bold text-amber-500 uppercase" style={{ fontFamily: 'var(--font-technical)' }}>
                  NOT ACCEPTED
                </span>
              </div>
              <div className="col-span-2">
                <span className="block text-[8px] font-mono font-bold text-[#5C5E58] tracking-widest uppercase" style={{ fontFamily: 'var(--font-technical)' }}>
                  RECORD STATE
                </span>
                <span className="text-xs font-mono font-bold text-amber-500 uppercase" style={{ fontFamily: 'var(--font-technical)' }}>
                  NOT CREATED
                </span>
              </div>
            </div>

            {/* Scrollable Form */}
            <div className="p-6 space-y-6 overflow-y-auto flex-1 text-left">
              {/* Title Field */}
              <div className="space-y-1.5">
                <label htmlFor="drawer-title" className="block text-[10px] font-mono font-bold text-[#A8AAA3] tracking-wider uppercase" style={{ fontFamily: 'var(--font-technical)' }}>
                  TITLE <span className="text-amber-500/80">*</span>
                </label>
                <input
                  id="drawer-title"
                  type="text"
                  value={drawerTitle}
                  onChange={(e) => {
                    setDrawerTitle(e.target.value);
                    setIsValidatedLocally(false);
                    if (validationError?.title) {
                      setValidationError((prev) => prev ? { ...prev, title: undefined } : null);
                    }
                  }}
                  aria-invalid={!!validationError?.title}
                  aria-describedby={validationError?.title ? "drawer-title-error" : "drawer-title-counter"}
                  className={`w-full px-3 py-2 bg-[#0A0A0A] border ${
                    validationError?.title ? 'border-red-500/50 focus:border-red-500' : 'border-[#242522] focus:border-[#D6FF3F]/60'
                  } text-xs font-mono text-[#F3F1EA] rounded-[1px] focus:outline-none transition-colors`}
                  style={{ fontFamily: 'var(--font-technical)' }}
                  maxLength={160}
                />
                <div className="flex justify-between items-start text-[9px] font-mono" style={{ fontFamily: 'var(--font-technical)' }}>
                  <div id="drawer-title-error" role="alert" className="text-red-500/90 pr-2">
                    {validationError?.title || ""}
                  </div>
                  <span id="drawer-title-counter" className="text-[#5C5E58] ml-auto whitespace-nowrap">
                    {drawerTitle.length}/160
                  </span>
                </div>
              </div>

              {/* Description Field */}
              <div className="space-y-1.5">
                <label htmlFor="drawer-desc" className="block text-[10px] font-mono font-bold text-[#A8AAA3] tracking-wider uppercase" style={{ fontFamily: 'var(--font-technical)' }}>
                  DESCRIPTION
                </label>
                <textarea
                  id="drawer-desc"
                  value={drawerDescription}
                  onChange={(e) => {
                    setDrawerDescription(e.target.value);
                    setIsValidatedLocally(false);
                    if (validationError?.description) {
                      setValidationError((prev) => prev ? { ...prev, description: undefined } : null);
                    }
                  }}
                  aria-invalid={!!validationError?.description}
                  aria-describedby={validationError?.description ? "drawer-desc-error" : "drawer-desc-counter"}
                  className={`w-full px-3 py-2 bg-[#0A0A0A] border h-24 resize-y min-h-[64px] max-h-[300px] ${
                    validationError?.description ? 'border-red-500/50 focus:border-red-500' : 'border-[#242522] focus:border-[#D6FF3F]/60'
                  } text-xs font-mono text-[#F3F1EA] rounded-[1px] focus:outline-none transition-colors`}
                  style={{ fontFamily: 'var(--font-technical)', resize: 'vertical' }}
                  maxLength={2000}
                />
                <div className="flex justify-between items-start text-[9px] font-mono" style={{ fontFamily: 'var(--font-technical)' }}>
                  <div id="drawer-desc-error" role="alert" className="text-red-500/90 pr-2">
                    {validationError?.description || ""}
                  </div>
                  <span id="drawer-desc-counter" className="text-[#5C5E58] ml-auto whitespace-nowrap">
                    {drawerDescription.length}/2000
                  </span>
                </div>
              </div>

              {/* Priority Field */}
              <div className="space-y-1.5">
                <label htmlFor="drawer-priority" className="block text-[10px] font-mono font-bold text-[#A8AAA3] tracking-wider uppercase" style={{ fontFamily: 'var(--font-technical)' }}>
                  PRIORITY <span className="text-amber-500/80">*</span>
                </label>
                <select
                  id="drawer-priority"
                  value={drawerPriority}
                  onChange={(e) => {
                    setDrawerPriority(e.target.value);
                    setIsValidatedLocally(false);
                    if (validationError?.priority) {
                      setValidationError((prev) => prev ? { ...prev, priority: undefined } : null);
                    }
                  }}
                  aria-invalid={!!validationError?.priority}
                  aria-describedby={validationError?.priority ? "drawer-priority-error" : undefined}
                  className={`w-full px-3 py-2 bg-[#0A0A0A] border ${
                    validationError?.priority ? 'border-red-500/50 focus:border-red-500' : 'border-[#242522] focus:border-[#D6FF3F]/60'
                  } text-xs font-mono text-[#F3F1EA] rounded-[1px] focus:outline-none transition-colors appearance-none`}
                  style={{ fontFamily: 'var(--font-technical)' }}
                >
                  <option value="">SELECT PRIORITY</option>
                  <option value="CRITICAL">CRITICAL</option>
                  <option value="HIGH">HIGH</option>
                  <option value="MEDIUM">MEDIUM</option>
                  <option value="LOW">LOW</option>
                </select>
                {validationError?.priority && (
                  <div id="drawer-priority-error" role="alert" className="text-[9px] font-mono text-red-500/90" style={{ fontFamily: 'var(--font-technical)' }}>
                    {validationError.priority}
                  </div>
                )}
              </div>

              {/* Assignee control */}
              <div className="space-y-1.5">
                <label htmlFor="drawer-assignee" className="block text-[10px] font-mono font-bold text-[#A8AAA3] tracking-wider uppercase" style={{ fontFamily: 'var(--font-technical)' }}>
                  ASSIGNEE
                </label>
                <select
                  id="drawer-assignee"
                  disabled
                  value="UNASSIGNED"
                  className="w-full px-3 py-2 bg-[#141513]/40 border border-[#242522] text-xs font-mono text-[#5C5E58] rounded-[1px] cursor-not-allowed uppercase"
                  style={{ fontFamily: 'var(--font-technical)' }}
                >
                  <option value="UNASSIGNED">UNASSIGNED</option>
                </select>
                <div className="flex items-center justify-between text-[8px] font-mono text-[#5C5E58]" style={{ fontFamily: 'var(--font-technical)' }}>
                  <span>ACTIVE MEMBERSHIP DATA</span>
                  <span className="text-[#5C5E58]">NOT LOADED</span>
                </div>
              </div>

              {/* Due Time field */}
              <div className="space-y-1.5">
                <label htmlFor="drawer-duetime" className="block text-[10px] font-mono font-bold text-[#A8AAA3] tracking-wider uppercase" style={{ fontFamily: 'var(--font-technical)' }}>
                  DUE TIME
                </label>
                <input
                  id="drawer-duetime"
                  type="datetime-local"
                  value={drawerDueTime}
                  onChange={(e) => {
                    setDrawerDueTime(e.target.value);
                    setIsValidatedLocally(false);
                  }}
                  className="w-full px-3 py-2 bg-[#0A0A0A] border border-[#242522] focus:border-[#D6FF3F]/60 text-xs font-mono text-[#F3F1EA] rounded-[1px] focus:outline-none transition-colors"
                  style={{ fontFamily: 'var(--font-technical)' }}
                />
              </div>

              {/* Future Record Preview Section */}
              <div className="border border-[#242522] bg-[#141513]/20 p-4 space-y-3 rounded-[1px]">
                <div className="flex items-center justify-between border-b border-[#242522] pb-1.5">
                  <span className="block text-[9px] font-mono font-bold text-[#F3F1EA] tracking-wider uppercase" style={{ fontFamily: 'var(--font-technical)' }}>
                    TASK RECORD PREVIEW
                  </span>
                  <span className="text-[8px] font-mono font-bold text-amber-500 uppercase" style={{ fontFamily: 'var(--font-technical)' }}>
                    FUTURE RECORD PREVIEW
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-y-2.5 gap-x-4 text-[9px] font-mono text-[#A8AAA3]" style={{ fontFamily: 'var(--font-technical)' }}>
                  <div>
                    <span className="block text-[8px] text-[#5C5E58] font-bold tracking-wider uppercase">STATUS AFTER CREATION</span>
                    <span className="font-semibold text-[#8C8E88] block">TODO</span>
                  </div>
                  <div>
                    <span className="block text-[8px] text-[#5C5E58] font-bold tracking-wider uppercase">SOURCE</span>
                    <span className="font-semibold text-[#8C8E88] block">AI</span>
                  </div>
                  <div>
                    <span className="block text-[8px] text-[#5C5E58] font-bold tracking-wider uppercase">OWNERSHIP</span>
                    <span className="font-semibold text-[#8C8E88] block">UNASSIGNED</span>
                  </div>
                  <div>
                    <span className="block text-[8px] text-[#5C5E58] font-bold tracking-wider uppercase">CLAIM STATE</span>
                    <span className="font-semibold text-[#8C8E88] block">NOT CLAIMED</span>
                  </div>
                  <div className="col-span-2">
                    <span className="block text-[8px] text-[#5C5E58] font-bold tracking-wider uppercase">BLOCKING REASON</span>
                    <span className="font-semibold text-[#8C8E88] block">NOT APPLICABLE</span>
                  </div>
                  <div className="col-span-2">
                    <span className="block text-[8px] text-[#5C5E58] font-bold tracking-wider uppercase">COMPLETION TIME</span>
                    <span className="font-semibold text-[#8C8E88] block">NOT AVAILABLE</span>
                  </div>
                </div>
              </div>

              {/* Authority Notice */}
              <div className="border-t border-[#242522] pt-4 space-y-1.5">
                <span className="block text-[8px] font-mono font-bold text-amber-500 tracking-wider uppercase" style={{ fontFamily: 'var(--font-technical)' }}>
                  HUMAN REVIEW DOES NOT CREATE A TASK.
                </span>
                <p className="text-[10px] text-[#8C8E88] leading-relaxed">
                  Task creation, assignment, status initialization, audit events, and claim safety will be enforced by the backend after authenticated authority is verified.
                </p>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="border-t border-[#242522] bg-[#141513]/30 p-6 space-y-4">
              {isValidatedLocally && (
                <div aria-live="polite" className="p-3.5 border border-amber-500/20 bg-amber-500/5 space-y-1 text-left rounded-[1px]">
                  <span className="block text-[9px] font-mono font-bold text-amber-500 tracking-wider uppercase" style={{ fontFamily: 'var(--font-technical)' }}>
                    TASK DRAFT VALIDATED LOCALLY
                  </span>
                  <p className="text-[10px] text-[#A8AAA3] leading-relaxed">
                    The reviewed suggestion is ready for backend-controlled task creation. No IncidentTask record has been created.
                  </p>
                </div>
              )}

              <div className="space-y-2">
                <button
                  onClick={validateDraft}
                  className="w-full py-2.5 px-4 bg-[#D6FF3F] hover:bg-[#D6FF3F]/90 text-[#0A0A0A] font-mono font-bold text-xs rounded-[1px] tracking-wider transition-colors cursor-pointer text-center uppercase"
                  style={{ fontFamily: 'var(--font-technical)' }}
                >
                  VALIDATE TASK DRAFT
                </button>

                <button
                  id="create-local-preview"
                  onClick={createLocalPreview}
                  disabled={!isValidatedLocally}
                  aria-disabled={!isValidatedLocally}
                  className={`w-full py-2.5 px-4 font-mono font-bold text-xs rounded-[1px] tracking-wider text-center uppercase transition-colors ${
                    isValidatedLocally
                      ? 'border border-amber-500/40 bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 cursor-pointer'
                      : 'border border-[#242522] bg-[#141513]/25 text-[#5C5E58] cursor-not-allowed'
                  }`}
                  style={{ fontFamily: 'var(--font-technical)' }}
                >
                  CREATE LOCAL TASK PREVIEW
                </button>

                <div className="space-y-1">
                  <button
                    disabled
                    aria-disabled="true"
                    className="w-full py-2.5 px-4 border border-[#242522] bg-[#141513]/20 text-[#5C5E58] font-mono font-bold text-xs rounded-[1px] tracking-wider cursor-not-allowed text-center uppercase"
                    style={{ fontFamily: 'var(--font-technical)' }}
                  >
                    CREATE TASK RECORD
                  </button>
                  <div className="text-[8px] font-mono text-[#5C5E58] text-center" style={{ fontFamily: 'var(--font-technical)' }}>
                    BACKEND AUTHORITY REQUIRED
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={handleReset}
                  className="py-2 px-3 border border-[#242522] bg-[#141513]/40 hover:bg-[#141513] text-[#A8AAA3] hover:text-[#F3F1EA] font-mono font-bold text-[10px] rounded-[1px] transition-colors cursor-pointer text-center uppercase"
                  style={{ fontFamily: 'var(--font-technical)' }}
                >
                  RESET TO AI SUGGESTION
                </button>
                <button
                  onClick={closeDrawer}
                  className="py-2 px-3 border border-[#242522] bg-[#141513]/40 hover:bg-[#141513] text-[#A8AAA3] hover:text-[#F3F1EA] font-mono font-bold text-[10px] rounded-[1px] transition-colors cursor-pointer text-center uppercase"
                  style={{ fontFamily: 'var(--font-technical)' }}
                >
                  CLOSE REVIEW
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Lifecycle Drawer (Phase 04) */}
      {isLifecycleDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Overlay */}
          <div 
            onClick={closeLifecycleDrawer}
            className="fixed inset-0 bg-black/60 backdrop-blur-[1px] transition-opacity duration-200"
            aria-hidden="true"
          />
          
          {/* Drawer container */}
          <div 
            ref={lifecycleDrawerRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="task-lifecycle-title"
            className="relative w-full sm:w-[480px] h-full bg-[#0E0F0D] border-l border-[#242522] flex flex-col shadow-2xl z-10 rounded-none overflow-hidden"
          >
            {/* Header */}
            <div className="border-b border-[#242522] bg-[#141513]/30 px-6 py-4 flex items-center justify-between">
              <div className="text-left">
                <h2 id="task-lifecycle-title" className="text-xs font-mono font-bold text-[#F3F1EA] tracking-wider uppercase" style={{ fontFamily: 'var(--font-technical)' }}>
                  TASK LIFECYCLE
                </h2>
                <span className="text-[9px] font-mono font-bold text-[#5C5E58] tracking-widest uppercase block mt-0.5" style={{ fontFamily: 'var(--font-technical)' }}>
                  LOCAL PREVIEW / FRONTEND SESSION
                </span>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <span className="block text-[8px] font-mono font-bold text-[#5C5E58] tracking-widest uppercase" style={{ fontFamily: 'var(--font-technical)' }}>
                    PREVIEW
                  </span>
                  <span className="text-[10px] font-mono font-bold text-amber-500 uppercase" style={{ fontFamily: 'var(--font-technical)' }}>
                    {selectedLifecyclePreview ? `LP-0${localPreviews.findIndex(p => p.sequence === selectedLifecyclePreview.sequence) + 1}` : ''}
                  </span>
                </div>
                <div className="text-right border-l border-[#242522] pl-4">
                  <span className="block text-[8px] font-mono font-bold text-[#5C5E58] tracking-widest uppercase" style={{ fontFamily: 'var(--font-technical)' }}>
                    AUTHORITY
                  </span>
                  <span className="text-[10px] font-mono font-bold text-amber-500 uppercase" style={{ fontFamily: 'var(--font-technical)' }}>
                    NON-AUTHORITATIVE
                  </span>
                </div>
                <div className="text-right border-l border-[#242522] pl-4">
                  <span className="block text-[8px] font-mono font-bold text-[#5C5E58] tracking-widest uppercase" style={{ fontFamily: 'var(--font-technical)' }}>
                    PERSISTENCE
                  </span>
                  <span className="text-[10px] font-mono font-bold text-amber-500 uppercase" style={{ fontFamily: 'var(--font-technical)' }}>
                    NOT CONNECTED
                  </span>
                </div>
                <button
                  onClick={closeLifecycleDrawer}
                  aria-label="Close task lifecycle"
                  className="p-1.5 text-[#A8AAA3] hover:text-[#D6FF3F] hover:bg-[#141513] border border-transparent hover:border-[#242522] rounded-[1px] transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Task Identity info */}
            <div className="grid grid-cols-2 gap-x-4 gap-y-3 p-6 bg-[#141513]/10 border-b border-[#242522] text-left">
              <div className="col-span-2">
                <span className="block text-[8px] font-mono font-bold text-[#5C5E58] tracking-widest uppercase" style={{ fontFamily: 'var(--font-technical)' }}>
                  TITLE
                </span>
                <span className="text-xs font-mono font-bold text-[#F3F1EA] uppercase block break-words animate-fade-in" style={{ fontFamily: 'var(--font-technical)' }}>
                  {selectedLifecyclePreview?.title}
                </span>
              </div>
              <div>
                <span className="block text-[8px] font-mono font-bold text-[#5C5E58] tracking-widest uppercase" style={{ fontFamily: 'var(--font-technical)' }}>
                  INCIDENT
                </span>
                <span className="text-xs font-mono font-bold text-[#F3F1EA] uppercase block" style={{ fontFamily: 'var(--font-technical)' }}>
                  SF-2026-0042
                </span>
              </div>
              <div>
                <span className="block text-[8px] font-mono font-bold text-[#5C5E58] tracking-widest uppercase" style={{ fontFamily: 'var(--font-technical)' }}>
                  PRIORITY
                </span>
                <span className="text-xs font-mono font-bold text-amber-500 uppercase block" style={{ fontFamily: 'var(--font-technical)' }}>
                  {selectedLifecyclePreview?.priority}
                </span>
              </div>
              <div>
                <span className="block text-[8px] font-mono font-bold text-[#5C5E58] tracking-widest uppercase" style={{ fontFamily: 'var(--font-technical)' }}>
                  SOURCE
                </span>
                <span className="text-xs font-mono font-bold text-[#F3F1EA] uppercase block" style={{ fontFamily: 'var(--font-technical)' }}>
                  AI
                </span>
              </div>
              <div>
                <span className="block text-[8px] font-mono font-bold text-[#5C5E58] tracking-widest uppercase" style={{ fontFamily: 'var(--font-technical)' }}>
                  TASK RECORD
                </span>
                <span className="text-xs font-mono font-bold text-[#8C8E88] uppercase block" style={{ fontFamily: 'var(--font-technical)' }}>
                  NOT CREATED
                </span>
              </div>
              <div className="col-span-2">
                <span className="block text-[8px] font-mono font-bold text-[#5C5E58] tracking-widest uppercase" style={{ fontFamily: 'var(--font-technical)' }}>
                  BACKEND AUTHORITY
                </span>
                <span className="text-xs font-mono font-bold text-amber-500 uppercase block" style={{ fontFamily: 'var(--font-technical)' }}>
                  REQUIRED
                </span>
              </div>
            </div>

            {/* Scrollable Body */}
            <div className="p-6 space-y-6 overflow-y-auto flex-1 text-left">
              {/* STATUS RAIL */}
              {selectedLifecyclePreview && (() => {
                const currentLifecycle = getLifecycleState(selectedLifecyclePreview.sequence);
                return (
                  <>
                    <div className="border border-[#242522] bg-[#141513]/10 p-4 rounded-[1px] space-y-3">
                      <div className="border-b border-[#242522] pb-1.5 mb-1 flex items-center justify-between">
                        <span className="text-[9px] font-mono font-bold text-[#F3F1EA] tracking-wider uppercase" style={{ fontFamily: 'var(--font-technical)' }}>
                          LIFECYCLE STATUS RAIL
                        </span>
                        <span className="text-[8px] font-mono font-bold text-amber-500 uppercase bg-amber-500/10 px-1 py-0.5 rounded-[1px]" style={{ fontFamily: 'var(--font-technical)' }}>
                          LOCAL PREVIEW
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 text-[9px] font-mono" style={{ fontFamily: 'var(--font-technical)' }}>
                        <div>
                          <span className="block text-[8px] text-[#5C5E58] font-bold tracking-wider uppercase">STATUS PREVIEW</span>
                          <span className="font-semibold text-amber-500 block truncate">{currentLifecycle.status}</span>
                        </div>
                        <div>
                          <span className="block text-[8px] text-[#5C5E58] font-bold tracking-wider uppercase">OWNERSHIP</span>
                          <span className="font-semibold text-[#8C8E88] block truncate">{currentLifecycle.ownership}</span>
                        </div>
                        <div>
                          <span className="block text-[8px] text-[#5C5E58] font-bold tracking-wider uppercase">CLAIM STATE</span>
                          <span className="font-semibold text-[#8C8E88] block truncate">{currentLifecycle.claimState}</span>
                        </div>
                        <div>
                          <span className="block text-[8px] text-[#5C5E58] font-bold tracking-wider uppercase">BLOCKING STATE</span>
                          <span className="font-semibold text-[#8C8E88] block truncate">
                            {currentLifecycle.blockingState === 'BLOCKED LOCALLY' ? 'BLOCKED LOCALLY' : 'NOT BLOCKED'}
                          </span>
                        </div>
                        <div>
                          <span className="block text-[8px] text-[#5C5E58] font-bold tracking-wider uppercase">COMPLETION STATE</span>
                          <span className="font-semibold text-[#8C8E88] block truncate">{currentLifecycle.completionState}</span>
                        </div>
                        <div>
                          <span className="block text-[8px] text-[#5C5E58] font-bold tracking-wider uppercase">PERSISTENCE</span>
                          <span className="font-semibold text-amber-500 block truncate">NOT CONNECTED</span>
                        </div>
                      </div>

                      {currentLifecycle.blockingState === 'BLOCKED LOCALLY' && currentLifecycle.blockingReason && (
                        <div className="mt-2.5 p-2.5 bg-red-950/10 border border-red-900/20 rounded-[1px] space-y-1">
                          <span className="block text-[8px] text-red-500 font-bold uppercase">BLOCKING REASON</span>
                          <p className="text-[10px] text-[#A8AAA3] leading-normal font-sans break-words">{currentLifecycle.blockingReason}</p>
                        </div>
                      )}

                      {currentLifecycle.completionState === 'COMPLETED LOCALLY' && (
                        <div className="mt-2.5 p-2.5 bg-emerald-950/10 border border-emerald-900/20 rounded-[1px] space-y-1">
                          <span className="block text-[8px] text-emerald-500 font-bold uppercase">COMPLETION NOTE</span>
                          <p className="text-[10px] text-[#A8AAA3] leading-normal font-sans break-words">
                            {currentLifecycle.completionNote || <span className="italic text-[#5C5E58]">NOT PROVIDED</span>}
                          </p>
                        </div>
                      )}

                      {currentLifecycle.status === 'IN PROGRESS' && currentLifecycle.previousBlockingReason && (
                        <div className="mt-2.5 p-2.5 bg-amber-950/10 border border-amber-900/20 rounded-[1px] space-y-1">
                          <span className="block text-[8px] text-amber-500 font-bold uppercase">PREVIOUS LOCAL BLOCK REASON</span>
                          <p className="text-[10px] text-[#A8AAA3] leading-normal font-sans break-words">{currentLifecycle.previousBlockingReason}</p>
                        </div>
                      )}
                    </div>

                    {/* LIFECYCLE MAP */}
                    <div className="space-y-2">
                      <span className="block text-[8px] font-mono font-bold text-[#5C5E58] tracking-widest uppercase" style={{ fontFamily: 'var(--font-technical)' }}>
                        LIFECYCLE MAP
                      </span>
                      <div className="grid grid-cols-5 gap-1 font-mono text-center text-[9px]" style={{ fontFamily: 'var(--font-technical)' }}>
                        {[
                          { id: 'TODO_UNCLAIMED', label: '01 TODO', active: currentLifecycle.status === 'TODO' && currentLifecycle.claimState === 'NOT CLAIMED' },
                          { id: 'CLAIMED', label: '02 CLAIMED', active: currentLifecycle.status === 'TODO' && currentLifecycle.claimState === 'CLAIMED LOCALLY' },
                          { id: 'IN_PROGRESS', label: '03 IN PROGRESS', active: currentLifecycle.status === 'IN PROGRESS' },
                          { id: 'BLOCKED', label: '04 BLOCKED', active: currentLifecycle.status === 'BLOCKED' },
                          { id: 'DONE', label: '05 DONE', active: currentLifecycle.status === 'DONE' },
                        ].map((step) => (
                          <div 
                            key={step.id} 
                            className={`p-2 border rounded-[1px] flex flex-col justify-between min-h-[50px] ${
                              step.active 
                                ? 'border-amber-500/60 bg-amber-500/5 text-amber-500 font-bold' 
                                : 'border-[#242522] bg-[#0E0F0D] text-[#5C5E58]'
                            }`}
                          >
                            <span>{step.label}</span>
                            {step.active && (
                              <span className="text-[7px] text-amber-500/80 font-bold uppercase mt-1 leading-none block">
                                LOCAL PREVIEW
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* ACTIONS SECTION */}
                    <div className="border-t border-[#242522] pt-4 space-y-4">
                      {currentLifecycle.status === 'TODO' && currentLifecycle.claimState === 'NOT CLAIMED' && (
                        <div className="space-y-3">
                          <div className="bg-[#141513]/20 border border-[#242522] p-3 rounded-[1px] space-y-1">
                            <span className="block text-[8px] font-mono font-bold text-amber-500 tracking-wider uppercase" style={{ fontFamily: 'var(--font-technical)' }}>
                              LOCAL CLAIM SIMULATION
                            </span>
                            <p className="text-[10px] text-[#8C8E88] leading-relaxed">
                              This action previews the claimed-task interface only. Active membership, concurrency protection, and assignment authority have not been verified.
                            </p>
                          </div>

                          <button
                            onClick={claimTaskLocally}
                            className="w-full py-2 px-4 border border-amber-500/40 bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 font-mono font-bold text-xs tracking-wider rounded-[1px] uppercase transition-colors text-center cursor-pointer"
                            style={{ fontFamily: 'var(--font-technical)' }}
                          >
                            CLAIM TASK LOCALLY
                          </button>
                        </div>
                      )}

                      {currentLifecycle.status === 'TODO' && currentLifecycle.claimState === 'CLAIMED LOCALLY' && (
                        <div className="space-y-3">
                          <div className="bg-[#141513]/20 border border-[#242522] p-3 rounded-[1px] space-y-1">
                            <span className="block text-[8px] font-mono font-bold text-amber-500 tracking-wider uppercase" style={{ fontFamily: 'var(--font-technical)' }}>
                              MEMBERSHIP AUTHORITY NOT VERIFIED
                            </span>
                            <p className="text-[10px] text-[#8C8E88] leading-relaxed">
                              Local claim established inside current session. Real assignment checks are bypassed.
                            </p>
                          </div>

                          <div className="space-y-2">
                            <button
                              onClick={startWorkLocally}
                              className="w-full py-2 px-4 border border-amber-500/40 bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 font-mono font-bold text-xs tracking-wider rounded-[1px] uppercase transition-colors text-center cursor-pointer"
                              style={{ fontFamily: 'var(--font-technical)' }}
                            >
                              START WORK LOCALLY
                            </button>
                            
                            <button
                              onClick={resetLocalClaim}
                              className="w-full py-2 px-4 border border-[#242522] bg-[#141513]/15 hover:bg-[#141513]/30 text-[#A8AAA3] font-mono font-bold text-xs tracking-wider rounded-[1px] uppercase transition-colors text-center cursor-pointer"
                              style={{ fontFamily: 'var(--font-technical)' }}
                            >
                              RESET LOCAL CLAIM
                            </button>
                          </div>
                        </div>
                      )}

                      {currentLifecycle.status === 'IN PROGRESS' && (
                        <div className="space-y-4">
                          <div className="bg-[#141513]/20 border border-[#242522] p-3 rounded-[1px] space-y-1">
                            <span className="block text-[8px] font-mono font-bold text-amber-500 tracking-wider uppercase" style={{ fontFamily: 'var(--font-technical)' }}>
                              WORK STATE: LOCAL SESSION ONLY
                            </span>
                            <p className="text-[10px] text-[#8C8E88] leading-relaxed">
                              Task progress is simulated. No execution or background work occurs.
                            </p>
                          </div>

                          {!isBlockingFormOpen && !isCompletionFormOpen && (
                            <div className="space-y-2">
                              <button
                                onClick={() => {
                                  setIsBlockingFormOpen(true);
                                  setBlockingReasonInput('');
                                  setBlockingReasonError(null);
                                }}
                                className="w-full py-2 px-4 border border-amber-500/40 bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 font-mono font-bold text-xs tracking-wider rounded-[1px] uppercase transition-colors text-center cursor-pointer"
                                style={{ fontFamily: 'var(--font-technical)' }}
                              >
                                MARK BLOCKED LOCALLY
                              </button>
                              
                              <button
                                onClick={() => {
                                  setIsCompletionFormOpen(true);
                                  setCompletionNoteInput('');
                                  setCompletionError(null);
                                  setIsCriticalConfirmed(false);
                                }}
                                className="w-full py-2 px-4 border border-emerald-500/40 bg-[#1A3F1F]/10 hover:bg-[#1A3F1F]/20 text-emerald-400 font-mono font-bold text-xs tracking-wider rounded-[1px] uppercase transition-colors text-center cursor-pointer"
                                style={{ fontFamily: 'var(--font-technical)' }}
                              >
                                COMPLETE LOCALLY
                              </button>

                              <button
                                onClick={resetLifecyclePreview}
                                className="w-full py-2 px-4 border border-[#242522] bg-[#141513]/15 hover:bg-[#141513]/30 text-[#A8AAA3] font-mono font-bold text-xs tracking-wider rounded-[1px] uppercase transition-colors text-center cursor-pointer"
                                style={{ fontFamily: 'var(--font-technical)' }}
                              >
                                RESET LIFECYCLE PREVIEW
                              </button>
                            </div>
                          )}

                          {isBlockingFormOpen && (
                            <form onSubmit={handleBlockingSubmit} className="space-y-3.5 border border-red-500/20 bg-red-950/5 p-4 rounded-[1px]">
                              <span className="block text-[9px] font-mono font-bold text-red-500 tracking-wider uppercase" style={{ fontFamily: 'var(--font-technical)' }}>
                                MARK BLOCKED LOCALLY
                              </span>

                              <div className="space-y-1.5 text-left">
                                <label 
                                  htmlFor="blocking-reason"
                                  className="block text-[8px] font-mono font-bold text-[#5C5E58] tracking-widest uppercase"
                                  style={{ fontFamily: 'var(--font-technical)' }}
                                >
                                  BLOCKING REASON *
                                </label>
                                <textarea
                                  id="blocking-reason"
                                  value={blockingReasonInput}
                                  onChange={(e) => {
                                    setBlockingReasonInput(e.target.value);
                                    if (blockingReasonError) setBlockingReasonError(null);
                                  }}
                                  aria-invalid={blockingReasonError ? 'true' : 'false'}
                                  aria-describedby={blockingReasonError ? 'blocking-reason-error' : undefined}
                                  placeholder="Waiting for confirmed payment-gateway health evidence."
                                  className="w-full h-24 px-3 py-2 bg-[#0A0A0A] border border-[#242522] focus:border-red-500/60 text-xs text-[#F3F1EA] rounded-[1px] focus:outline-none transition-colors resize-none"
                                  style={{ fontFamily: 'Inter, sans-serif' }}
                                />
                                <div className="flex items-center justify-between text-[8px] font-mono text-[#5C5E58]" style={{ fontFamily: 'var(--font-technical)' }}>
                                  <span>MIN 5, MAX 500 CHARACTERS</span>
                                  <span className={blockingReasonInput.length > 500 ? 'text-red-500 font-bold' : ''}>
                                    {blockingReasonInput.length} / 500
                                  </span>
                                </div>
                                {blockingReasonError && (
                                  <p id="blocking-reason-error" className="text-[10px] font-mono font-bold text-red-500 uppercase mt-1" style={{ fontFamily: 'var(--font-technical)' }}>
                                    {blockingReasonError}
                                  </p>
                                )}
                              </div>

                              <div className="grid grid-cols-2 gap-2 pt-1">
                                <button
                                  type="submit"
                                  className="w-full py-2 px-3 border border-red-500/40 bg-red-950/20 hover:bg-red-950/30 text-red-400 font-mono font-bold text-[10px] rounded-[1px] uppercase transition-colors cursor-pointer text-center"
                                  style={{ fontFamily: 'var(--font-technical)' }}
                                >
                                  CONFIRM LOCAL BLOCK
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setIsBlockingFormOpen(false);
                                    setBlockingReasonError(null);
                                  }}
                                  className="w-full py-2 px-3 border border-[#242522] bg-[#141513]/15 text-[#A8AAA3] font-mono font-bold text-[10px] rounded-[1px] uppercase transition-colors cursor-pointer text-center"
                                  style={{ fontFamily: 'var(--font-technical)' }}
                                >
                                  CANCEL
                                </button>
                              </div>
                            </form>
                          )}

                          {isCompletionFormOpen && (
                            <form onSubmit={handleCompletionSubmit} className="space-y-4 border border-emerald-500/20 bg-emerald-950/5 p-4 rounded-[1px]">
                              <div className="space-y-0.5">
                                <span className="block text-[9px] font-mono font-bold text-emerald-400 tracking-wider uppercase" style={{ fontFamily: 'var(--font-technical)' }}>
                                  LOCAL COMPLETION REVIEW
                                </span>
                                <span className="block text-[8px] font-mono font-bold text-[#5C5E58] tracking-widest uppercase" style={{ fontFamily: 'var(--font-technical)' }}>
                                  SIMULATING TASK CLOSURE
                                </span>
                              </div>

                              <div className="space-y-1.5 text-left">
                                <label 
                                  htmlFor="completion-note"
                                  className="block text-[8px] font-mono font-bold text-[#5C5E58] tracking-widest uppercase"
                                  style={{ fontFamily: 'var(--font-technical)' }}
                                >
                                  COMPLETION NOTE (OPTIONAL)
                                </label>
                                <textarea
                                  id="completion-note"
                                  value={completionNoteInput}
                                  onChange={(e) => {
                                    setCompletionNoteInput(e.target.value);
                                    if (completionError) setCompletionError(null);
                                  }}
                                  aria-invalid={completionError ? 'true' : 'false'}
                                  aria-describedby={completionError ? 'completion-error' : undefined}
                                  placeholder="Describe resolution evidence or findings..."
                                  className="w-full h-24 px-3 py-2 bg-[#0A0A0A] border border-[#242522] focus:border-emerald-500/60 text-xs text-[#F3F1EA] rounded-[1px] focus:outline-none transition-colors resize-none"
                                  style={{ fontFamily: 'Inter, sans-serif' }}
                                />
                                <div className="flex items-center justify-between text-[8px] font-mono text-[#5C5E58]" style={{ fontFamily: 'var(--font-technical)' }}>
                                  <span>MAX 1000 CHARACTERS</span>
                                  <span className={completionNoteInput.length > 1000 ? 'text-red-500 font-bold' : ''}>
                                    {completionNoteInput.length} / 1000
                                  </span>
                                </div>
                                {completionError && (
                                  <p id="completion-error" className="text-[10px] font-mono font-bold text-red-500 uppercase mt-1" style={{ fontFamily: 'var(--font-technical)' }}>
                                    {completionError}
                                  </p>
                                )}
                              </div>

                              {selectedLifecyclePreview?.priority === 'CRITICAL' && (
                                <div className="space-y-2 border border-amber-500/20 bg-amber-500/5 p-3 rounded-[1px] text-left">
                                  <div className="flex items-start gap-2.5">
                                    <input
                                      type="checkbox"
                                      id="critical-completion-confirm"
                                      checked={isCriticalConfirmed}
                                      onChange={(e) => {
                                        setIsCriticalConfirmed(e.target.checked);
                                        if (completionError && e.target.checked) {
                                          setCompletionError(null);
                                        }
                                      }}
                                      className="mt-0.5 border-[#242522] bg-[#0A0A0A] rounded-[1px] focus:ring-amber-500/40 text-amber-500"
                                    />
                                    <label 
                                      htmlFor="critical-completion-confirm"
                                      className="text-[10px] font-mono font-bold text-[#F3F1EA] uppercase cursor-pointer"
                                      style={{ fontFamily: 'var(--font-technical)' }}
                                    >
                                      I CONFIRM THIS CRITICAL TASK IS COMPLETE
                                    </label>
                                  </div>
                                  <p className="text-[9px] text-[#8C8E88] leading-relaxed">
                                    Critical task completion requires explicit human confirmation. This frontend preview does not create an authoritative completion record.
                                  </p>
                                </div>
                              )}

                              <div className="grid grid-cols-2 gap-2 pt-1">
                                <button
                                  type="submit"
                                  className="w-full py-2 px-3 border border-emerald-500/40 bg-emerald-950/20 hover:bg-emerald-950/30 text-emerald-400 font-mono font-bold text-[10px] rounded-[1px] uppercase transition-colors cursor-pointer text-center"
                                  style={{ fontFamily: 'var(--font-technical)' }}
                                >
                                  CONFIRM LOCAL COMPLETION
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setIsCompletionFormOpen(false);
                                    setCompletionError(null);
                                  }}
                                  className="w-full py-2 px-3 border border-[#242522] bg-[#141513]/15 text-[#A8AAA3] font-mono font-bold text-[10px] rounded-[1px] uppercase transition-colors cursor-pointer text-center"
                                  style={{ fontFamily: 'var(--font-technical)' }}
                                >
                                  CANCEL
                                </button>
                              </div>
                            </form>
                          )}
                        </div>
                      )}

                      {currentLifecycle.status === 'BLOCKED' && (
                        <div className="space-y-3">
                          <div className="bg-[#141513]/20 border border-[#242522] p-3 rounded-[1px] space-y-1">
                            <span className="block text-[8px] font-mono font-bold text-amber-500 tracking-wider uppercase" style={{ fontFamily: 'var(--font-technical)' }}>
                              TASK PREVIEW BLOCKED
                            </span>
                            <p className="text-[10px] text-[#8C8E88] leading-relaxed">
                              Currently blocked locally. Completion is unavailable until resumed.
                            </p>
                          </div>

                          <div className="space-y-2">
                            <button
                              onClick={resumeWorkLocally}
                              className="w-full py-2 px-4 border border-amber-500/40 bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 font-mono font-bold text-xs tracking-wider rounded-[1px] uppercase transition-colors text-center cursor-pointer"
                              style={{ fontFamily: 'var(--font-technical)' }}
                            >
                              RESUME WORK LOCALLY
                            </button>

                            <button
                              onClick={resetLifecyclePreview}
                              className="w-full py-2 px-4 border border-[#242522] bg-[#141513]/15 hover:bg-[#141513]/30 text-[#A8AAA3] font-mono font-bold text-xs tracking-wider rounded-[1px] uppercase transition-colors text-center cursor-pointer"
                              style={{ fontFamily: 'var(--font-technical)' }}
                            >
                              RESET LIFECYCLE PREVIEW
                            </button>
                          </div>
                        </div>
                      )}

                      {currentLifecycle.status === 'DONE' && (
                        <div className="space-y-3">
                          <div className="bg-[#141513]/20 border border-[#242522] p-3 rounded-[1px] space-y-1">
                            <span className="block text-[8px] font-mono font-bold text-amber-500 tracking-wider uppercase" style={{ fontFamily: 'var(--font-technical)' }}>
                              LOCAL LIFECYCLE PREVIEW COMPLETE
                            </span>
                            <p className="text-[10px] text-[#8C8E88] leading-relaxed">
                              This task reached the Done interface state only within the current frontend session. No task record, completion timestamp, audit event, or authoritative status exists.
                            </p>
                          </div>

                          <button
                            onClick={resetLifecyclePreview}
                            className="w-full py-2 px-4 border border-[#242522] bg-[#141513]/15 hover:bg-[#141513]/30 text-[#A8AAA3] font-mono font-bold text-xs tracking-wider rounded-[1px] uppercase transition-colors text-center cursor-pointer"
                            style={{ fontFamily: 'var(--font-technical)' }}
                          >
                            RESET LIFECYCLE PREVIEW
                          </button>
                        </div>
                      )}
                    </div>
                  </>
                );
              })()}
            </div>

            {/* AUTHORITY CONTRACT FOOTER */}
            <div className="border-t border-[#242522] bg-[#141513]/30 p-6 space-y-4 shrink-0">
              <div className="flex items-center justify-between border-b border-[#242522]/40 pb-1.5">
                <span className="block text-[8px] font-mono font-bold text-[#5C5E58] tracking-widest uppercase" style={{ fontFamily: 'var(--font-technical)' }}>
                  LIFECYCLE CONTRACT
                </span>
                <span className="text-[8px] font-mono font-bold text-amber-500 uppercase" style={{ fontFamily: 'var(--font-technical)' }}>
                  FUTURE SPECIFICATION
                </span>
              </div>

              <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 text-[9px] font-mono text-[#A8AAA3]" style={{ fontFamily: 'var(--font-technical)' }}>
                <div className="flex items-center justify-between border-b border-[#242522]/20 pb-1 col-span-2">
                  <span className="text-[#5C5E58] font-bold uppercase text-[8px]">CLAIM SAFETY</span>
                  <span className="font-semibold text-amber-500">SERVER REQUIRED</span>
                </div>
                <div className="flex items-center justify-between border-b border-[#242522]/20 pb-1 col-span-2">
                  <span className="text-[#5C5E58] font-bold uppercase text-[8px]">ASSIGNEE AUTHORITY</span>
                  <span className="font-semibold text-amber-500">ACTIVE MEMBER REQUIRED</span>
                </div>
                <div className="flex items-center justify-between border-b border-[#242522]/20 pb-1 col-span-2">
                  <span className="text-[#5C5E58] font-bold uppercase text-[8px]">STATUS TRANSITIONS</span>
                  <span className="font-semibold text-amber-500">SERVER CONTROLLED</span>
                </div>
                <div className="flex items-center justify-between border-b border-[#242522]/20 pb-1 col-span-2">
                  <span className="text-[#5C5E58] font-bold uppercase text-[8px]">BLOCKING REASON</span>
                  <span className="font-semibold text-amber-500">REQUIRED WHEN BLOCKED</span>
                </div>
                <div className="flex items-center justify-between border-b border-[#242522]/20 pb-1 col-span-2">
                  <span className="text-[#5C5E58] font-bold uppercase text-[8px]">CRITICAL COMPLETION</span>
                  <span className="font-semibold text-[#8C8E88]">EXPLICIT CONFIRMATION REQUIRED</span>
                </div>
                <div className="flex items-center justify-between border-b border-[#242522]/20 pb-1 col-span-2">
                  <span className="text-[#5C5E58] font-bold uppercase text-[8px]">AUDIT EVENT</span>
                  <span className="font-semibold text-[#8C8E88]">NOT CREATED</span>
                </div>
                <div className="flex items-center justify-between border-b border-[#242522]/20 pb-1 col-span-2">
                  <span className="text-[#5C5E58] font-bold uppercase text-[8px]">TIMESTAMP</span>
                  <span className="font-semibold text-[#8C8E88]">NOT GENERATED</span>
                </div>
                <div className="flex items-center justify-between border-b border-[#242522]/20 pb-1 col-span-2">
                  <span className="text-[#5C5E58] font-bold uppercase text-[8px]">REALTIME</span>
                  <span className="font-semibold text-[#8C8E88]">NOT CONNECTED</span>
                </div>
              </div>

              <div className="pt-1.5 space-y-1 text-left">
                <span className="block text-[8px] font-mono font-bold text-red-500 tracking-wider uppercase" style={{ fontFamily: 'var(--font-technical)' }}>
                  LOCAL STATE IS NOT OPERATIONAL AUTHORITY.
                </span>
                <p className="text-[10px] text-[#8C8E88] leading-relaxed">
                  Backend-created task records must enforce membership, concurrency-safe claiming, valid transitions, timestamps, audit events, and realtime synchronization.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TASK WORKSPACE DRAWER (Phase 03 Layout Refactor) */}
      {isWorkspaceDrawerOpen && (
        <div className="fixed inset-0 z-40 flex justify-end">
          {/* Overlay */}
          <div 
            onClick={closeWorkspaceDrawer}
            className="fixed inset-0 bg-black/60 backdrop-blur-[1px] transition-opacity duration-200"
            aria-hidden="true"
          />
          
          {/* Drawer container */}
          <div 
            ref={workspaceDrawerRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="task-workspace-title"
            className="relative w-full md:w-[720px] h-full bg-[#0E0F0D] border-l border-[#242522] flex flex-col shadow-2xl z-10 rounded-none overflow-hidden"
          >
            {/* Header */}
            <div className="border-b border-[#242522] bg-[#141513]/30 px-6 py-4 flex items-center justify-between shrink-0">
              <div className="text-left">
                <h2 id="task-workspace-title" className="text-xs font-mono font-bold text-[#F3F1EA] tracking-wider uppercase" style={{ fontFamily: 'var(--font-technical)' }}>
                  TASK WORKSPACE
                </h2>
                <span className="text-[9px] font-mono font-bold text-[#5C5E58] tracking-widest uppercase block mt-0.5" style={{ fontFamily: 'var(--font-technical)' }}>
                  RECOMMENDED SUITE / SESSION PREVIEW
                </span>
              </div>
              <div className="flex items-center gap-4">
                <button
                  onClick={closeWorkspaceDrawer}
                  aria-label="Close task workspace"
                  className="p-1.5 text-[#A8AAA3] hover:text-[#D6FF3F] hover:bg-[#141513] border border-transparent hover:border-[#242522] rounded-[1px] transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Scrollable Workspace Content */}
            <div className="flex-1 overflow-y-auto min-h-0 bg-[#0E0F0D] flex flex-col">
              {renderFullTaskWorkspace(true)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
