'use client';

import {useEffect, useState} from 'react';

import {Button} from '@/components/ui/button';
import {Tabs, TabsList, TabsTrigger} from '@/components/ui/tabs';

import {FileText, LayoutDashboard, Shield, Users} from 'lucide-react';

import {PageHeader} from '@/components/app-headers';
import AdminDashboardSkeleton from '@/components/skeleton/admin-dashboard-skeleton';
import {Comments, Posts, Sections} from '@/constants/data';
import {useRouter} from 'next/navigation';
import {toast} from 'sonner';
import {AdminFilter} from './components/filter';
import {AdminSearch} from './components/searchbar';
import {AdTab} from './components/tabs/ads';
import {ContentTab} from './components/tabs/content';
import {OverViewTab} from './components/tabs/overview';
import {ReportsTab} from './components/tabs/reports';
import {UsersTab} from './components/tabs/users/users-tab';

// Mock data for ads pending approval
const pendingAds = [
  {
    id: '1',
    title: 'New Fitness Program',
    description: 'Transform your body in 30 days with our proven program',
    sponsor: 'FitLife Inc',
    type: 'banner',
    section: '5',
    duration: '30',
    submitted: new Date(2023, 4, 1),
    status: 'pending',
  },
  {
    id: '2',
    title: 'Summer Tech Sale',
    description: 'Huge discounts on all electronic devices this summer',
    sponsor: 'TechWorld',
    type: 'post',
    section: '1',
    duration: '14',
    submitted: new Date(2023, 4, 2),
    status: 'pending',
  },
];

// Mock data for reports
const reports = [
  {
    id: '1',
    type: 'post',
    contentId: '3',
    reason: 'Inappropriate content',
    reportedBy: 'user123',
    timestamp: new Date(2023, 4, 1),
    status: 'pending',
    content: 'This is some inappropriate post content that was reported.',
  },
  {
    id: '2',
    type: 'comment',
    contentId: '5',
    reason: 'Harassment',
    reportedBy: 'user456',
    timestamp: new Date(2023, 4, 2),
    status: 'pending',
    content: 'This is a harassing comment that was reported.',
  },
];

// Suspension period options
const suspensionPeriods = [
  {value: '1', label: '1 day'},
  {value: '3', label: '3 days'},
  {value: '7', label: '7 days'},
  {value: '14', label: '14 days'},
  {value: '30', label: '30 days'},
  {value: 'permanent', label: 'Permanent'},
];

const user = {
  id: '1',
  username: 'johndoe',
  displayName: 'John Doe',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
  verified: true,
  bio: 'Tech enthusiast and coffee lover',
  followers: ['4', '3', '5'],
  following: ['1', '2', '3'],
  joined: new Date('2022-03-15'),
  email: 'john@example.com',
};
export const AdminDashboardPage = () => {
  const navigate = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentTab, setCurrentTab] = useState('overview');
  const [filterIsOpen, setFilterIsOpen] = useState(false);
  const [filterSection, setFilterSection] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterDateRange, setFilterDateRange] = useState('all');

  // Dialog states
  const [rejectAdDialog, setRejectAdDialog] = useState(false);
  const [selectedAd, setSelectedAd] = useState<string>('');
  const [rejectReason, setRejectReason] = useState('');

  const [userActionDialog, setUserActionDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [userActionType, setUserActionType] = useState<
    'suspend' | 'ban' | 'view'
  >('view');
  const [userActionReason, setUserActionReason] = useState('');
  const [suspensionPeriod, setSuspensionPeriod] = useState('7');

  const [reportActionDialog, setReportActionDialog] = useState(false);
  const [selectedReport, setSelectedReport] = useState<string>('');
  const [reportAction, setReportAction] = useState<
    'resolve' | 'warn' | 'suspend' | 'ban'
  >('resolve');
  const [reportActionReason, setReportActionReason] = useState('');

  const [contentActionDialog, setContentActionDialog] = useState(false);
  const [selectedContent, setSelectedContent] = useState<string>('');
  const [contentAction, setContentAction] = useState<
    'delete' | 'edit' | 'close'
  >('close');
  const [contentActionReason, setContentActionReason] = useState('');

  const [viewContentDialog, setViewContentDialog] = useState(false);
  const [selectedReportContent, setSelectedReportContent] =
    useState<string>('');
  const [selectedReportType, setSelectedReportType] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    setTimeout(() => setIsLoading(false), 800);
  }, []);

  // Check if user has admin or superadmin role
  //  const isAdmin = user?.role === 'admin' || user?.role === 'superadmin';
  //const isSuperAdmin = user?.role === 'superadmin';

  // Filter data based on search terms and filters
  const filteredAds = pendingAds.filter(ad => {
    const matchesSearch =
      searchTerm === '' ||
      ad.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ad.sponsor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ad.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSection =
      filterSection === 'all' || ad.section === filterSection;
    const matchesStatus = filterStatus === 'all' || ad.status === filterStatus;

    return matchesSearch && matchesSection && matchesStatus;
  });

  const filteredUsers = [
    {
      id: '1',
      displayName: 'John Doe',
      username: 'johndoe',
      posts: 5,
      status: 'active',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
    },
    {
      id: '2',
      displayName: 'Jane Doe',
      username: 'janedoe',
      posts: 3,
      status: 'active',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane',
    },
  ].filter(user => {
    if (searchTerm === '') return true;
    return (
      user.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.username.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const filteredReports = reports.filter(report => {
    if (searchTerm === '') return true;
    return (
      report.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.reportedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.type.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const filteredPosts = Posts.filter(post => {
    if (searchTerm === '') return true;
    return (
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.displayName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const filteredComments = Comments.filter(comment => {
    if (searchTerm === '') return true;
    return (
      comment.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comment.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comment.displayName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Simulated admin check - in a real app, check admin role from user object
  const isAdmin = user?.username === 'johndoe'; // Temporary condition for demo

  // Mock data for charts
  const sectionData = Sections.map(cat => ({
    name: cat.ch,
    posts: Posts.filter(post => post.sectionId === cat.id).length,
    comments: Posts.filter(post => post.sectionId === cat.id).reduce(
      (acc, post) => {
        const postComments = Comments.filter(c => c.postId === post.id).length;
        return acc + postComments;
      },
      0,
    ),
  }));

  const userActivityData = [
    {name: 'New Users', value: 45},
    {name: 'Active Users', value: 125},
    {name: 'Inactive', value: 30},
  ];

  const COLORS = [
    '#0088FE',
    '#00C49F',
    '#FFBB28',
    '#FF8042',
    '#8884d8',
    '#82ca9d',
  ];

  if (!isAdmin) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-bold mb-2">Access Denied</h2>
        <p className="mb-4">
          You do not have permission to access the admin dashboard.
        </p>
        <Button variant="outline" onClick={() => navigate.push('/home')}>
          Back to Home
        </Button>
      </div>
    );
  }

  const handleApproveAd = (adId: string) => {
    toast.success(`Advertisement #${adId} has been approved`);
  };

  const handleOpenRejectAdDialog = (adId: string) => {
    setSelectedAd(adId);
    setRejectReason('');
    setRejectAdDialog(true);
  };

  const handleRejectAd = () => {
    if (!rejectReason) {
      toast.error('Please provide a reason for rejection');
      return;
    }

    toast.success(
      `Advertisement #${selectedAd} has been rejected: ${rejectReason}`,
    );
    setRejectAdDialog(false);
  };

  const handleOpenUserActionDialog = (
    userId: string,
    action: 'view' | 'suspend' | 'ban',
  ) => {
    setSelectedUser(userId);
    setUserActionType(action);
    setUserActionReason('');
    setSuspensionPeriod('7');
    setUserActionDialog(true);
  };

  const handleUserAction = () => {
    if (
      (userActionType === 'suspend' || userActionType === 'ban') &&
      !userActionReason
    ) {
      toast.error('Please provide a reason');
      return;
    }

    if (userActionType === 'view') {
      navigate.push(`/profile/${selectedUser}`);
    } else if (userActionType === 'suspend') {
      toast.success(
        `User ${selectedUser} has been suspended for ${
          suspensionPeriods.find(p => p.value === suspensionPeriod)?.label
        }`,
      );
    } else {
      toast.success(`User ${selectedUser} has been banned`);
    }

    setUserActionDialog(false);
  };

  const handleOpenReportActionDialog = (
    reportId: string,
    action: 'resolve' | 'warn' | 'suspend' | 'ban',
  ) => {
    setSelectedReport(reportId);
    setReportAction(action);
    setReportActionReason('');
    setReportActionDialog(true);
  };

  const handleReportAction = () => {
    if (
      (reportAction === 'warn' ||
        reportAction === 'suspend' ||
        reportAction === 'ban') &&
      !reportActionReason
    ) {
      toast.error('Please provide a reason');
      return;
    }

    if (reportAction === 'resolve') {
      toast.success(`Report #${selectedReport} has been resolved`);
    } else if (reportAction === 'warn') {
      toast.success(`Warning issued for report #${selectedReport}`);
    } else if (reportAction === 'suspend') {
      toast.success(
        `User has been suspended based on report #${selectedReport}`,
      );
    } else {
      toast.success(`User has been banned based on report #${selectedReport}`);
    }

    setReportActionDialog(false);
  };

  const handleOpenContentActionDialog = (
    contentId: string,
    action: 'delete' | 'edit' | 'close',
  ) => {
    setSelectedContent(contentId);
    setContentAction(action);
    setContentActionReason('');
    setContentActionDialog(true);
  };

  const handleContentAction = () => {
    if (!contentActionReason) {
      toast.error('Please provide a reason');
      return;
    }

    if (contentAction === 'delete') {
      toast.success(`Content #${selectedContent} has been deleted`);
    } else if (contentAction === 'edit') {
      toast.success(`Content #${selectedContent} has been edited`);
    } else {
      toast.success(
        `Comments for content #${selectedContent} have been closed`,
      );
    }

    setContentActionDialog(false);
  };

  const handleViewReportedContent = (report: any) => {
    setSelectedReportContent(report.content);
    setSelectedReportType(report.type);
    setViewContentDialog(true);
  };

  if (isLoading) {
    return <AdminDashboardSkeleton />;
  }
  return (
    <div>
      <PageHeader
        title="Admin Dashboard"
        description="Manage content, users, and advertisements"
      />

      <div className="p-4">
        <Tabs
          defaultValue="overview"
          className="w-full"
          onValueChange={setCurrentTab}>
          <div className="border-b mb-4 border-app-border">
            <TabsList className="flex overflow-x-auto">
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <LayoutDashboard size={16} /> Overview
              </TabsTrigger>
              <TabsTrigger value="ads" className="flex items-center gap-2">
                <FileText size={16} /> Advertisements
              </TabsTrigger>
              <TabsTrigger value="users" className="flex items-center gap-2">
                <Users size={16} /> Users
              </TabsTrigger>
              <TabsTrigger value="reports" className="flex items-center gap-2">
                <Shield size={16} /> Reports
              </TabsTrigger>
              <TabsTrigger value="content" className="flex items-center gap-2">
                <FileText size={16} /> Content
              </TabsTrigger>
            </TabsList>
          </div>

          <AdminSearch
            searchTerm={searchTerm}
            setFilterIsOpen={setFilterIsOpen}
            setSearchTerm={setSearchTerm}
            filterIsOpen={filterIsOpen}
          />

          {filterIsOpen && (
            <AdminFilter
              filterSection={filterSection}
              filterStatus={filterStatus}
              setFilterDateRange={setFilterDateRange}
              setFilterSection={setFilterSection}
              setFilterStatus={setFilterStatus}
              setFilterIsOpen={setFilterIsOpen}
              filterDateRange={filterDateRange}
            />
          )}

          <OverViewTab
            filterSection={filterSection}
            filterStatus={filterStatus}
            setCurrentTab={setCurrentTab}
            searchTerm={searchTerm}
            tabValue="overview"
          />

          <AdTab
            filterSection={filterSection}
            filterStatus={filterStatus}
            searchTerm={searchTerm}
            tabValue="ads"
          />

          <UsersTab
            filterSection={filterSection}
            filterStatus={filterStatus}
            searchTerm={searchTerm}
            tabValue="users"
          />

          <ReportsTab
            filterSection={filterSection}
            filterStatus={filterStatus}
            searchTerm={searchTerm}
            tabValue="reports"
          />
          <ContentTab
            filterSection={filterSection}
            filterStatus={filterStatus}
            searchTerm={searchTerm}
            tabValue="content"
          />
        </Tabs>
      </div>
    </div>
  );
};
