import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

export interface Task {
  id: number;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  tag: string;
  dueDate: string;
  assignee: string;
  avatarColor: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  sidebarOpen: boolean = false;
  showAddModal: boolean = false;
  activeFilter: string = 'all';
  searchQuery: string = '';
  currentUser = { name: 'Akanksha Tiwari', email: 'admin@task.io', initials: 'AT' };

  newTask: Partial<Task> = {
    title: '', description: '', status: 'todo', priority: 'medium', tag: 'Design', dueDate: '', assignee: 'Alex M.'
  };

  tasks: Task[] = [
    { id: 1, title: 'Redesign landing page hero section', description: 'Update visuals to match new brand guidelines', status: 'in-progress', priority: 'high', tag: 'Design', dueDate: '2025-06-12', assignee: 'Alex M.', avatarColor: '#6366f1' },
    { id: 2, title: 'Fix payment gateway timeout bug', description: 'Stripe webhook fails after 30s on slow networks', status: 'todo', priority: 'high', tag: 'Bug', dueDate: '2025-06-08', assignee: 'Sam K.', avatarColor: '#14b8a6' },
    { id: 3, title: 'Write Q2 performance report', description: 'Include KPIs, revenue, and team metrics', status: 'done', priority: 'medium', tag: 'Docs', dueDate: '2025-05-30', assignee: 'Jordan P.', avatarColor: '#f59e0b' },
    { id: 4, title: 'Set up CI/CD pipeline', description: 'GitHub Actions for staging and production deploy', status: 'in-progress', priority: 'medium', tag: 'DevOps', dueDate: '2025-06-15', assignee: 'Alex M.', avatarColor: '#6366f1' },
    { id: 5, title: 'Conduct user interviews', description: 'Talk to 10 customers about onboarding friction', status: 'todo', priority: 'low', tag: 'Research', dueDate: '2025-06-20', assignee: 'Mia T.', avatarColor: '#ec4899' },
    { id: 6, title: 'Update API documentation', description: 'Swagger docs for v2 endpoints', status: 'done', priority: 'low', tag: 'Docs', dueDate: '2025-05-28', assignee: 'Sam K.', avatarColor: '#14b8a6' },
    { id: 7, title: 'Implement dark mode toggle', description: 'Persist preference in localStorage', status: 'todo', priority: 'medium', tag: 'Feature', dueDate: '2025-06-18', assignee: 'Jordan P.', avatarColor: '#f59e0b' },
    { id: 8, title: 'Security audit – dependency scan', description: 'Run npm audit and patch CVEs', status: 'in-progress', priority: 'high', tag: 'Security', dueDate: '2025-06-10', assignee: 'Mia T.', avatarColor: '#ec4899' },
  ];

  private nextId = 9;

  ngOnInit() {}

  get filteredTasks(): Task[] {
    let list = this.tasks;
    if (this.activeFilter !== 'all') list = list.filter(t => t.status === this.activeFilter);
    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase();
      list = list.filter(t => t.title.toLowerCase().includes(q) || t.tag.toLowerCase().includes(q));
    }
    return list;
  }

  get todoCount() { return this.tasks.filter(t => t.status === 'todo').length; }
  get inProgressCount() { return this.tasks.filter(t => t.status === 'in-progress').length; }
  get doneCount() { return this.tasks.filter(t => t.status === 'done').length; }
  get totalCount() { return this.tasks.length; }
  get completionPercent() { return this.totalCount ? Math.round((this.doneCount / this.totalCount) * 100) : 0; }

  setFilter(f: string) { this.activeFilter = f; }

  toggleSidebar() { this.sidebarOpen = !this.sidebarOpen; }

  openAddModal() {
    this.newTask = { title: '', description: '', status: 'todo', priority: 'medium', tag: 'Design', dueDate: '', assignee: 'Alex M.' };
    this.showAddModal = true;
  }

  closeModal() { this.showAddModal = false; }

  addTask() {
    if (!this.newTask.title?.trim()) return;
    const colors: Record<string, string> = { 'Alex M.': '#6366f1', 'Sam K.': '#14b8a6', 'Jordan P.': '#f59e0b', 'Mia T.': '#ec4899' };
    this.tasks.unshift({
      id: this.nextId++,
      title: this.newTask.title!,
      description: this.newTask.description || '',
      status: this.newTask.status as Task['status'],
      priority: this.newTask.priority as Task['priority'],
      tag: this.newTask.tag || 'General',
      dueDate: this.newTask.dueDate || '',
      assignee: this.newTask.assignee || 'Alex M.',
      avatarColor: colors[this.newTask.assignee || 'Alex M.'] || '#6366f1',
    });
    this.closeModal();
  }

  deleteTask(id: number) { this.tasks = this.tasks.filter(t => t.id !== id); }

  cycleStatus(task: Task) {
    const cycle: Task['status'][] = ['todo', 'in-progress', 'done'];
    const idx = cycle.indexOf(task.status);
    task.status = cycle[(idx + 1) % cycle.length];
  }

  getInitials(name: string): string {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  }

  formatDate(date: string): string {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  }

  isOverdue(date: string): boolean {
    if (!date) return false;
    return new Date(date) < new Date() && true;
  }

  logout() {
    // In a real app, clear auth state here
    window.location.href = '/';
  }

  trackById(_: number, t: Task) { return t.id; }
}