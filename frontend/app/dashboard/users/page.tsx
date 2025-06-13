"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  UserPlus,
  Edit,
  Trash2,
  Users,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { useToast } from "@/hooks/use-toast";

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  mobile: string;
  gender: string;
  status: string;
  roles: Array<{ name: string }>;
}

interface PaginationResponse {
  content: User[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const { toast } = useToast();

  // Pagination state
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [sortColumn, setSortColumn] = useState("firstName");

  const [newUser, setNewUser] = useState({
    email: "",
    firstName: "",
    lastName: "",
    mobile: "",
    gender: "MALE",
    status: "ACTIVE",
    password: "",
    roles: [{ name: "USER" }],
  });
  useEffect(() => {
    const getCookie = (name: string) => {
      const value = `; ${document.cookie}`;
      const parts: any = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop().split(";").shift();
    };

    const myCookieValue = getCookie("auth-token");
    setToken(myCookieValue);
    console.log("auth-token:", myCookieValue);
  }, []);
  useEffect(() => {
    fetchUsers();
  }, [currentPage, pageSize, sortColumn]);

  useEffect(() => {
    let filtered = users;

    if (searchTerm) {
      filtered = filtered.filter(
        (user) =>
          user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(
        (user) => user.status.toLowerCase() === statusFilter.toLowerCase()
      );
    }

    setFilteredUsers(filtered);
  }, [users, searchTerm, statusFilter]);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `http://localhost:8081/api/v1/users/paginated?column=${sortColumn}&size=${pageSize}&page=${currentPage}`
      );

      if (response.ok) {
        const data: PaginationResponse = await response.json();
        setUsers(data.content);
        setTotalPages(data.totalPages);
        setTotalElements(data.totalElements);
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch users",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch users",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddUser = async () => {
    try {
      // Validate required fields
      if (
        !newUser.email ||
        !newUser.firstName ||
        !newUser.lastName ||
        !newUser.password
      ) {
        toast({
          title: "Validation Error",
          description: "Please fill in all required fields",
          variant: "destructive",
        });
        return;
      }
      const formattedData = {
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        mobile: newUser.mobile,
        email: newUser.email,
        gender: newUser.gender,
        status: newUser.status,
        password: newUser.password,
        role: newUser.roles[0].name,
      };

      console.log("Submitting new user data:", formattedData);

      const response = await fetch("http://localhost:8081/api/v1/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formattedData),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "User added successfully",
        });
        setIsAddDialogOpen(false);
        setNewUser({
          email: "",
          firstName: "",
          lastName: "",
          mobile: "",
          gender: "MALE",
          status: "ACTIVE",
          password: "",
          roles: [{ name: "USER" }],
        });
        fetchUsers();
      } else {
        const errorData = await response.json();
        toast({
          title: "Error",
          description: errorData.message || "Failed to add user",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add user",
        variant: "destructive",
      });
    }
  };

  const handleEditClick = (user: User) => {
    setEditingUser(user);
    console.log("Editing user: ", user);
    setIsEditDialogOpen(true);
  };

  const handleEditUser = async () => {
    try {
      if (!editingUser) return;

      console.log("editing user ", editingUser);
      // Validate required fields
      if (
        !editingUser.email ||
        !editingUser.firstName ||
        !editingUser.lastName
      ) {
        toast({
          title: "Validation Error",
          description: "Please fill in all required fields",
          variant: "destructive",
        });
        return;
      }
      const formattedData = {
        firstName: editingUser.firstName,
        lastName: editingUser.lastName,
        mobile: editingUser.mobile,
        email: editingUser.email,
        gender: editingUser.gender,
        status: editingUser.status,
        role: editingUser.roles.map((role) => role.name),
      };

      console.log("Submitting user data:", formattedData);
      const response = await fetch(
        `http://localhost:8081/api/v1/users/${editingUser.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
          body: JSON.stringify(formattedData),
        }
      );

      if (response.ok) {
        toast({
          title: "Success",
          description: "User updated successfully",
        });
        setIsEditDialogOpen(false);
        setEditingUser(null);
        fetchUsers();
      } else {
        const errorData = await response.json();
        toast({
          title: "Error",
          description: errorData.message || "Failed to update user",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update user",
        variant: "destructive",
      });
    }
  };

  const handleDeleteUser = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:8081/api/v1/users/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "User deleted successfully",
        });
        fetchUsers();
      } else {
        const errorData = await response.json();
        toast({
          title: "Error",
          description: errorData.message || "Failed to delete user",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete user",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleSortChange = (column: string) => {
    setSortColumn(column);
    setCurrentPage(0); // Reset to first page when changing sort
  };

  if (isLoading && users.length === 0) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Users</h1>
            <p className="text-muted-foreground">
              Manage system users and their permissions
            </p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <UserPlus className="mr-2 h-4 w-4" />
                Add User
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New User</DialogTitle>
                <DialogDescription>
                  Create a new user account with roles and permissions
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="email" className="text-right">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={newUser.email}
                    onChange={(e) =>
                      setNewUser({ ...newUser, email: e.target.value })
                    }
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="firstName" className="text-right">
                    First Name
                  </Label>
                  <Input
                    id="firstName"
                    value={newUser.firstName}
                    onChange={(e) =>
                      setNewUser({ ...newUser, firstName: e.target.value })
                    }
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="lastName" className="text-right">
                    Last Name
                  </Label>
                  <Input
                    id="lastName"
                    value={newUser.lastName}
                    onChange={(e) =>
                      setNewUser({ ...newUser, lastName: e.target.value })
                    }
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="password" className="text-right">
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    value={newUser.password}
                    onChange={(e) =>
                      setNewUser({ ...newUser, password: e.target.value })
                    }
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="mobile" className="text-right">
                    Mobile
                  </Label>
                  <Input
                    id="mobile"
                    value={newUser.mobile}
                    onChange={(e) =>
                      setNewUser({ ...newUser, mobile: e.target.value })
                    }
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="gender" className="text-right">
                    Gender
                  </Label>
                  <Select
                    value={newUser.gender}
                    onValueChange={(value) =>
                      setNewUser({ ...newUser, gender: value })
                    }
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MALE">Male</SelectItem>
                      <SelectItem value="FEMALE">Female</SelectItem>
                      <SelectItem value="OTHER">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="status" className="text-right">
                    Status
                  </Label>
                  <Select
                    value={newUser.status}
                    onValueChange={(value) =>
                      setNewUser({ ...newUser, status: value })
                    }
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ACTIVE">Active</SelectItem>
                      <SelectItem value="INACTIVE">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="role" className="text-right">
                    Role
                  </Label>
                  <Select
                    value={newUser.roles[0]?.name}
                    onValueChange={(value) =>
                      setNewUser({
                        ...newUser,
                        roles: [{ name: value }],
                      })
                    }
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ADMIN">Admin</SelectItem>
                      <SelectItem value="USER">User</SelectItem>
                      <SelectItem value="GUEST">Guest</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleAddUser}>Add User</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="flex gap-4 items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sortColumn} onValueChange={handleSortChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="firstName">First Name</SelectItem>
              <SelectItem value="lastName">Last Name</SelectItem>
              <SelectItem value="email">Email</SelectItem>
              <SelectItem value="status">Status</SelectItem>
              <SelectItem value="createdAt">Created Date</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredUsers.map((user) => (
            <Card key={user.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarFallback>
                        {user.firstName[0]}
                        {user.lastName[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">
                        {user.firstName} {user.lastName}
                      </CardTitle>
                      <CardDescription>{user.email}</CardDescription>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditClick(user)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteUser(user.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      Mobile:
                    </span>
                    <span className="text-sm">{user.mobile}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      Gender:
                    </span>
                    <span className="text-sm">{user.gender}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      Status:
                    </span>
                    <Badge className={getStatusColor(user.status)}>
                      {user.status}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      Roles:
                    </span>
                    <div className="flex gap-1 flex-wrap">
                      {user.roles && user.roles.length > 0 ? (
                        user.roles.map((role, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="text-xs"
                          >
                            {role.name}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-sm text-muted-foreground">
                          No roles
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Pagination Controls */}
        {totalPages > 0 && (
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Showing {users.length} of {totalElements} users
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePreviousPage}
                disabled={currentPage === 0}
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">Previous Page</span>
              </Button>
              <div className="text-sm">
                Page {currentPage + 1} of {totalPages}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleNextPage}
                disabled={currentPage === totalPages - 1}
              >
                <ChevronRight className="h-4 w-4" />
                <span className="sr-only">Next Page</span>
              </Button>
              <Select
                value={pageSize.toString()}
                onValueChange={(value) => {
                  setPageSize(Number(value));
                  setCurrentPage(0); // Reset to first page when changing page size
                }}
              >
                <SelectTrigger className="w-[80px]">
                  <SelectValue placeholder="10" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {/* Edit User Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit User</DialogTitle>
              <DialogDescription>
                Update user details and permissions
              </DialogDescription>
            </DialogHeader>
            {editingUser && (
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-email" className="text-right">
                    Email
                  </Label>
                  <Input
                    id="edit-email"
                    type="email"
                    value={editingUser.email}
                    onChange={(e) =>
                      setEditingUser({
                        ...editingUser,
                        email: e.target.value,
                      })
                    }
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-firstName" className="text-right">
                    First Name
                  </Label>
                  <Input
                    id="edit-firstName"
                    value={editingUser.firstName}
                    onChange={(e) =>
                      setEditingUser({
                        ...editingUser,
                        firstName: e.target.value,
                      })
                    }
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-lastName" className="text-right">
                    Last Name
                  </Label>
                  <Input
                    id="edit-lastName"
                    value={editingUser.lastName}
                    onChange={(e) =>
                      setEditingUser({
                        ...editingUser,
                        lastName: e.target.value,
                      })
                    }
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-mobile" className="text-right">
                    Mobile
                  </Label>
                  <Input
                    id="edit-mobile"
                    value={editingUser.mobile}
                    onChange={(e) =>
                      setEditingUser({
                        ...editingUser,
                        mobile: e.target.value,
                      })
                    }
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-gender" className="text-right">
                    Gender
                  </Label>
                  <Select
                    value={editingUser.gender}
                    onValueChange={(value) =>
                      setEditingUser({ ...editingUser, gender: value })
                    }
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MALE">Male</SelectItem>
                      <SelectItem value="FEMALE">Female</SelectItem>
                      <SelectItem value="OTHER">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-status" className="text-right">
                    Status
                  </Label>
                  <Select
                    value={editingUser.status}
                    onValueChange={(value) =>
                      setEditingUser({ ...editingUser, status: value })
                    }
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ACTIVE">Active</SelectItem>
                      <SelectItem value="INACTIVE">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-role" className="text-right">
                    Role
                  </Label>
                  <Select
                    value={editingUser.roles[0]?.name}
                    onValueChange={(value) =>
                      setEditingUser({
                        ...editingUser,
                        roles: [{ name: value }],
                      })
                    }
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ADMIN">Admin</SelectItem>
                      <SelectItem value="USER">User</SelectItem>
                      <SelectItem value="GUEST">Guest</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsEditDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleEditUser}>Update User</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <Users className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-2 text-sm font-semibold">No users found</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {searchTerm || statusFilter !== "all"
                ? "Try adjusting your search or filter criteria"
                : "Get started by adding your first user"}
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
