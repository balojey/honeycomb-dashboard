import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Sidebar from "@/components/shared/Sidebar";
import Breadcrumb from "@/components/shared/Breadcrumb";
import { UserMenu } from "@/components/auth/UserMenu";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronsUpDown, Plus, Clipboard } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
// import { useHoneycomb } from "@/hooks/useHoneycomb";
import { projectsService, Project, Wallet, walletsService } from "@/lib/database";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  // const { createProject, createProfilesTree } = useHoneycomb();
  const { user, session } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      if (user) {
        try {
          const userProjects = await projectsService.getUserProjects();
          setProjects(userProjects);
          if (userProjects.length > 0) {
            const currentProject = localStorage.getItem("selectedProject");
            if (currentProject) {
              const project = userProjects.find((p) => p.id === currentProject);
              setSelectedProject(project || userProjects[0]);
            } else {
              setSelectedProject(userProjects[0]);
            }
          }
        } catch (error) {
          console.error("Error fetching projects:", error);
          toast.error("Failed to fetch projects.");
        }
      }
    };

    fetchProjects();
  }, [user]);

  useEffect(() => {
    if (selectedProject) {
      localStorage.setItem("selectedProject", selectedProject.id);
    }
  }, [selectedProject]);

  const handleSave = async () => {
    if (!projectName.trim()) {
      toast.error("Please enter a project name");
      return;
    }

    if (!user || !session) {
      toast.error("You must be logged in to create a project");
      return;
    }

    setIsCreating(true);

    const wallet = await walletsService.getUserWallet();

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/create-project`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: projectName.trim(),
          secretKey: wallet?.secret_key,
        }),
      });

      const data = await response.json();
      console.log("Project creation response:", data);

      await projectsService.createProject(projectName.trim(), data.project.address);

      if (!response.ok) {
        throw new Error(data.message || "Failed to create project.");
      }

      if (data.project) {
        toast.success(`Project "${projectName}" created successfully!`);
        setProjects([data.project, ...projects]);
        setSelectedProject(data.project);
        handleCancel();
      } else {
        throw new Error("Failed to save project to database");
      }
    } catch (error) {
      console.error("Error creating project:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to create project. Please try again."
      );
    } finally {
      setIsCreating(false);
    }
  };

  const handleCancel = () => {
    setProjectName("");
    setIsModalOpen(false);
  };

  const handleProjectSelect = (project: Project) => {
    setSelectedProject(project);
    navigate(`/`); // Navigate to a relevant page if needed
  };

  const handleCopyAddress = () => {
    if (selectedProject) {
      navigator.clipboard.writeText(selectedProject.address);
      toast.success("Project address copied to clipboard!");
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900 overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <header className="flex items-center justify-between p-6 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <Breadcrumb />
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-48 flex items-center justify-between">
                    <span className="truncate">{selectedProject ? selectedProject.name : "Select Project"}</span>
                    <ChevronsUpDown className="h-4 w-4 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-48">
                  <DropdownMenuLabel>Projects</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {projects.map((project) => (
                    <DropdownMenuItem key={project.id} onClick={() => handleProjectSelect(project)}>
                      {project.name}
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onSelect={() => setIsModalOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create New Project
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button variant="ghost" size="icon" onClick={handleCopyAddress} disabled={!selectedProject}>
                <Clipboard className="h-4 w-4" />
              </Button>
            </div>
            <UserMenu />
          </div>
        </header>
        <main className="flex-1 p-6 overflow-y-auto pb-20">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Outlet />
          </motion.div>
        </main>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Project</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="project-name">Project Name</Label>
              <Input
                id="project-name"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="Enter project name..."
              />
            </div>
          </div>
          <DialogFooter className="flex gap-2">
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isCreating || !projectName.trim()}>
              {isCreating ? "Creating..." : "Create Project"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}