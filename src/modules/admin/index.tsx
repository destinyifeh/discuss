'use client';

import {useEffect, useState} from 'react';

import {Button} from '@/components/ui/button';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {Input} from '@/components/ui/input';
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs';

import {
  Ban,
  BellRing,
  Calendar,
  CheckCircle,
  Edit,
  FileText,
  Filter,
  LayoutDashboard,
  Search,
  Shield,
  User,
  Users,
  XCircle,
} from 'lucide-react';

import {PageHeader} from '@/components/app-headers';
import AdminDashboardSkeleton from '@/components/skeleton/admin-dashboard-skeleton';
import {Avatar, AvatarFallback, AvatarImage} from '@/components/ui/avatar';
import {Badge} from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {Label} from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {Textarea} from '@/components/ui/textarea';
import {Comments, Posts, Sections} from '@/constants/data';
import {cn} from '@/lib/utils';
import {useRouter} from 'next/navigation';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {toast} from 'sonner';

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

          <div className="mb-4 flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search..."
                className="pl-8"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setFilterIsOpen(!filterIsOpen)}
              className={cn(filterIsOpen && 'bg-app text-white')}>
              <Filter className="h-4 w-4" />
            </Button>
          </div>

          {filterIsOpen && (
            <Card className="mb-4">
              <CardContent className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="filter-section">section</Label>
                  <Select
                    value={filterSection}
                    onValueChange={setFilterSection}>
                    <SelectTrigger id="filter-section">
                      <SelectValue placeholder="Select section" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {Sections.map(section => (
                        <SelectItem key={section.id} value={section.id}>
                          {section.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="filter-status">Status</Label>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger id="filter-status">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="filter-date">Date Range</Label>
                  <Select
                    value={filterDateRange}
                    onValueChange={setFilterDateRange}>
                    <SelectTrigger id="filter-date">
                      <SelectValue placeholder="Select date range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Time</SelectItem>
                      <SelectItem value="today">Today</SelectItem>
                      <SelectItem value="week">This Week</SelectItem>
                      <SelectItem value="month">This Month</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="md:col-span-3 flex justify-end">
                  <Button
                    variant="outline"
                    className="mr-2"
                    onClick={() => {
                      setFilterSection('all');
                      setFilterStatus('all');
                      setFilterDateRange('all');
                    }}>
                    Reset Filters
                  </Button>
                  <Button
                    onClick={() => setFilterIsOpen(false)}
                    variant="outline"
                    className="text-white bg-app-dark border-app-dark-border hover:text-black hover:bg-app-hover">
                    Apply Filters
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Users
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1,254</div>
                  <p className="text-xs text-muted-foreground">
                    +7% from last month
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    Active Posts
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{Posts.length}</div>
                  <p className="text-xs text-muted-foreground">
                    +12% from last month
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    Pending Ads
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{filteredAds.length}</div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={() => setCurrentTab('ads')}>
                    Review
                  </Button>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>section Activity</CardTitle>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={sectionData}
                    margin={{top: 20, right: 30, left: 20, bottom: 5}}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="posts" name="Posts" fill="#8884d8" />
                    <Bar dataKey="comments" name="Comments" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>User Distribution</CardTitle>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={userActivityData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({name, percent}) =>
                        `${name}: ${(percent * 100).toFixed(0)}%`
                      }
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value">
                      {userActivityData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 border-b pb-4">
                    <BellRing className="text-app" />
                    <div>
                      <p className="text-sm font-medium">
                        New user registration
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Sarah Johnson joined the platform
                      </p>
                    </div>
                    <div className="ml-auto text-xs text-muted-foreground">
                      5m ago
                    </div>
                  </div>
                  <div className="flex items-center gap-4 border-b pb-4">
                    <BellRing className="text-app" />
                    <div>
                      <p className="text-sm font-medium">
                        New advertisement submitted
                      </p>
                      <p className="text-xs text-muted-foreground">
                        TechWorld submitted a new ad
                      </p>
                    </div>
                    <div className="ml-auto text-xs text-muted-foreground">
                      20m ago
                    </div>
                  </div>
                  <div className="flex items-center gap-4 border-b pb-4">
                    <BellRing className="text-red-500" />
                    <div>
                      <p className="text-sm font-medium">New content report</p>
                      <p className="text-xs text-muted-foreground">
                        A post was reported for inappropriate content
                      </p>
                    </div>
                    <div className="ml-auto text-xs text-muted-foreground">
                      1h ago
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ads" className="space-y-4">
            <h2 className="text-lg font-bold">Pending Advertisements</h2>

            {filteredAds.length > 0 ? (
              filteredAds.map(ad => (
                <Card key={ad.id} className="mb-4">
                  <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="font-bold">{ad.title}</h3>
                        <p className="text-sm text-app-gray mb-2">
                          {ad.description}
                        </p>

                        <div className="flex flex-wrap gap-2 mb-2">
                          <Badge variant="outline">
                            {ad.type === 'banner'
                              ? 'Banner Ad'
                              : ad.type === 'post'
                              ? 'Sponsored Post'
                              : 'Feed Ad'}
                          </Badge>
                          <Badge variant="outline">
                            Duration: {ad.duration} days
                          </Badge>
                          <Badge variant="secondary">Pending Review</Badge>
                        </div>

                        <p className="text-xs text-app-gray">
                          By <span className="font-medium">{ad.sponsor}</span> ·
                          Submitted {ad.submitted.toLocaleDateString()}
                        </p>

                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-2"
                          onClick={() => {
                            toast.info(
                              'Ad preview functionality would be implemented here',
                            );
                          }}>
                          Preview Ad
                        </Button>
                      </div>

                      <div className="flex flex-col gap-2 w-full md:w-auto">
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() => handleApproveAd(ad.id)}>
                          <CheckCircle size={16} className="mr-1" /> Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleOpenRejectAdDialog(ad.id)}>
                          <XCircle size={16} className="mr-1" /> Reject
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="p-6 text-center">
                  <p className="text-app-gray">
                    No pending advertisements found
                  </p>
                </CardContent>
              </Card>
            )}

            <h2 className="text-lg font-bold mt-8">Active Advertisements</h2>
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-app-gray">No active advertisements found</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-4">
            <h2 className="text-lg font-bold">All Users</h2>

            {filteredUsers.length > 0 ? (
              <div className="rounded-md border border-app-border">
                <div className="p-4 bg-app-hover dark:bg-app-dark-bg/10">
                  <div className="grid grid-cols-1 md:grid-cols-5 font-medium">
                    <div>User</div>
                    <div>Username</div>
                    <div className="hidden md:block">Posts</div>
                    <div className="hidden md:block">Status</div>
                    <div>Actions</div>
                  </div>
                </div>
                <div className="divide-y divide-app-border">
                  {filteredUsers.map(user => (
                    <div
                      key={user.id}
                      className="grid grid-cols-1 md:grid-cols-5 items-center p-4">
                      <div className="flex items-center gap-2 mb-2 md:mb-0">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user.avatar} />
                          <AvatarFallback>
                            {user.displayName?.charAt(0) || 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <div>{user.displayName}</div>
                      </div>
                      <div className="mb-2 md:mb-0">{user.username}</div>
                      <div className="hidden md:block">{user.posts}</div>
                      <div className="hidden md:block">
                        <Badge variant="outline" className="border-app-border">
                          {user.status}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            handleOpenUserActionDialog(user.username, 'view')
                          }>
                          <User size={14} className="mr-1" /> View
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-yellow-500"
                          onClick={() =>
                            handleOpenUserActionDialog(user.username, 'suspend')
                          }>
                          <Calendar size={14} className="mr-1" /> Suspend
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-500"
                          onClick={() =>
                            handleOpenUserActionDialog(user.username, 'ban')
                          }>
                          <Ban size={14} className="mr-1" /> Ban
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <Card>
                <CardContent className="p-6 text-center">
                  <p className="text-app-gray">
                    No users found matching your search
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="reports" className="space-y-4">
            <h2 className="text-lg font-bold">Reported Content</h2>

            {filteredReports.length > 0 ? (
              filteredReports.map(report => (
                <Card key={report.id} className="mb-4">
                  <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                      <div>
                        <h3 className="font-bold">
                          {report.type === 'post' ? 'Post' : 'Comment'} reported
                          for {report.reason}
                        </h3>

                        <div className="flex flex-wrap gap-2 my-2">
                          <Badge variant="destructive">Reported</Badge>
                          <Badge
                            variant="outline"
                            className="border-app-border">
                            {report.type}
                          </Badge>
                        </div>

                        <p className="text-xs text-app-gray">
                          Reported by{' '}
                          <span className="font-medium">
                            {report.reportedBy}
                          </span>{' '}
                          · {report.timestamp.toLocaleDateString()}
                        </p>

                        <Button
                          size="sm"
                          variant="outline"
                          className="mt-2"
                          onClick={() => handleViewReportedContent(report)}>
                          View Content
                        </Button>
                      </div>

                      <div className="flex flex-col gap-2 w-full md:w-auto">
                        <Button
                          size="sm"
                          className="bg-green-700 hover:bg-green-600"
                          onClick={() =>
                            handleOpenReportActionDialog(report.id, 'resolve')
                          }>
                          Resolve
                        </Button>
                        <Button
                          size="sm"
                          className="bg-yellow-600 hover:bg-yellow-500"
                          onClick={() =>
                            handleOpenReportActionDialog(report.id, 'warn')
                          }>
                          Warn User
                        </Button>
                        <Button
                          size="sm"
                          className="bg-orange-600 hover:bg-orange-500"
                          onClick={() =>
                            handleOpenReportActionDialog(report.id, 'suspend')
                          }>
                          Suspend User
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() =>
                            handleOpenReportActionDialog(report.id, 'ban')
                          }>
                          Ban User
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="p-6 text-center">
                  <p className="text-app-gray">
                    No reports found matching your search
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="content" className="space-y-4">
            <h2 className="text-lg font-bold">All Content</h2>

            {filteredPosts.length > 0 ? (
              <div className="rounded-md border mb-8 border-app-border">
                <div className="p-4 bg-app-hover dark:bg-background">
                  <h3 className="font-bold">Posts</h3>
                </div>
                <div className="divide-y divide-app-border">
                  {filteredPosts.slice(0, 5).map(post => (
                    <div
                      key={post.id}
                      className="grid grid-cols-1 md:grid-cols-4 gap-2 p-4">
                      <div className="font-medium truncate">{post.title}</div>
                      <div>By {post.displayName}</div>
                      <div>{post.comments || 0} comments</div>
                      <div className="flex flex-wrap gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate.push(`/post/${post.id}`)}>
                          View
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-blue-500"
                          onClick={() =>
                            handleOpenContentActionDialog(post.id, 'edit')
                          }>
                          <Edit size={14} className="mr-1" /> Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-orange-500"
                          onClick={() =>
                            handleOpenContentActionDialog(post.id, 'close')
                          }>
                          Close Comments
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-500"
                          onClick={() =>
                            handleOpenContentActionDialog(post.id, 'delete')
                          }>
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <Card>
                <CardContent className="p-6 text-center">
                  <p className="text-app-gray">
                    No posts found matching your search
                  </p>
                </CardContent>
              </Card>
            )}

            {filteredComments.length > 0 ? (
              <div className="rounded-md border border-app-border">
                <div className="p-4 bg-app-hover dark:bg-background">
                  <h3 className="font-bold">Comments</h3>
                </div>
                <div className="divide-y divide-app-border">
                  {filteredComments.slice(0, 5).map(comment => (
                    <div
                      key={comment.id}
                      className="grid grid-cols-1 md:grid-cols-4 gap-2 p-4">
                      <div className="truncate">
                        {comment.content.substring(0, 50)}...
                      </div>
                      <div>By {comment.displayName}</div>
                      <div>On post #{comment.postId}</div>
                      <div className="flex flex-wrap gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            navigate.push(`/post/${comment.postId}`)
                          }>
                          View Post
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-blue-500"
                          onClick={() =>
                            handleOpenContentActionDialog(comment.id, 'edit')
                          }>
                          <Edit size={14} className="mr-1" /> Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-500"
                          onClick={() =>
                            handleOpenContentActionDialog(comment.id, 'delete')
                          }>
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <Card>
                <CardContent className="p-6 text-center">
                  <p className="text-app-gray">
                    No comments found matching your search
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Reject Ad Dialog */}
      <Dialog open={rejectAdDialog} onOpenChange={setRejectAdDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Advertisement</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this advertisement.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="reason">Reason for rejection</Label>
              <Textarea
                id="reason"
                placeholder="Enter reason for rejection"
                value={rejectReason}
                onChange={e => setRejectReason(e.target.value)}
                className="form-input"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectAdDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleRejectAd}>
              Reject
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* User Action Dialog */}
      <Dialog open={userActionDialog} onOpenChange={setUserActionDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {userActionType === 'view'
                ? 'User Details'
                : userActionType === 'suspend'
                ? 'Suspend User'
                : 'Ban User'}
            </DialogTitle>
            <DialogDescription>
              {userActionType === 'view'
                ? 'View user profile information'
                : userActionType === 'suspend'
                ? 'Temporarily suspend this user account'
                : 'Permanently ban this user from the platform'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {userActionType === 'suspend' && (
              <div className="space-y-2">
                <Label htmlFor="suspension-period">Suspension Period</Label>
                <Select
                  value={suspensionPeriod}
                  onValueChange={setSuspensionPeriod}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select period" />
                  </SelectTrigger>
                  <SelectContent>
                    {suspensionPeriods.map(period => (
                      <SelectItem key={period.value} value={period.value}>
                        {period.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {(userActionType === 'suspend' || userActionType === 'ban') && (
              <div className="space-y-2">
                <Label htmlFor="reason">Reason</Label>
                <Textarea
                  id="reason"
                  placeholder={`Enter reason for ${
                    userActionType === 'suspend' ? 'suspension' : 'ban'
                  }`}
                  value={userActionReason}
                  onChange={e => setUserActionReason(e.target.value)}
                  className="form-input"
                />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setUserActionDialog(false)}>
              Cancel
            </Button>
            <Button
              variant={userActionType === 'view' ? 'default' : 'destructive'}
              onClick={handleUserAction}>
              {userActionType === 'view'
                ? 'View Profile'
                : userActionType === 'suspend'
                ? 'Suspend User'
                : 'Ban User'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Report Action Dialog */}
      <Dialog open={reportActionDialog} onOpenChange={setReportActionDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {reportAction === 'resolve'
                ? 'Resolve Report'
                : reportAction === 'warn'
                ? 'Warn User'
                : reportAction === 'suspend'
                ? 'Suspend User'
                : 'Ban User'}
            </DialogTitle>
            <DialogDescription>
              Please provide details for this action.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {reportAction !== 'resolve' && (
              <div className="space-y-2">
                <Label htmlFor="reason">Message to User</Label>
                <Textarea
                  id="reason"
                  placeholder="Enter message to user"
                  value={reportActionReason}
                  onChange={e => setReportActionReason(e.target.value)}
                  className="form-input"
                />
              </div>
            )}

            {reportAction === 'suspend' && (
              <div className="space-y-2">
                <Label htmlFor="suspension-period">Suspension Period</Label>
                <Select defaultValue="7">
                  <SelectTrigger>
                    <SelectValue placeholder="Select period" />
                  </SelectTrigger>
                  <SelectContent>
                    {suspensionPeriods.slice(0, -1).map(period => (
                      <SelectItem key={period.value} value={period.value}>
                        {period.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setReportActionDialog(false)}>
              Cancel
            </Button>
            <Button
              variant={
                reportAction === 'resolve'
                  ? 'default'
                  : reportAction === 'warn'
                  ? 'outline'
                  : 'destructive'
              }
              onClick={handleReportAction}>
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Content Action Dialog */}
      <Dialog open={contentActionDialog} onOpenChange={setContentActionDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {contentAction === 'delete'
                ? 'Delete Content'
                : contentAction === 'edit'
                ? 'Edit Content'
                : 'Close Comments'}
            </DialogTitle>
            <DialogDescription>
              Please provide a reason for this action.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="reason">Reason</Label>
              <Textarea
                id="reason"
                placeholder="Enter reason"
                value={contentActionReason}
                onChange={e => setContentActionReason(e.target.value)}
                className="form-input"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setContentActionDialog(false)}>
              Cancel
            </Button>
            <Button
              variant={contentAction === 'delete' ? 'destructive' : 'default'}
              onClick={handleContentAction}>
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Reported Content Dialog */}
      <Dialog open={viewContentDialog} onOpenChange={setViewContentDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {selectedReportType === 'post'
                ? 'Reported Post'
                : 'Reported Comment'}
            </DialogTitle>
            <DialogDescription>
              Review the reported content below.
            </DialogDescription>
          </DialogHeader>
          <div className="p-4 border rounded-md max-h-96 overflow-y-auto">
            {selectedReportContent}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setViewContentDialog(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
