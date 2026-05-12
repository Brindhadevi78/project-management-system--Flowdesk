import React, { useState } from 'react';
import AvatarGroup from './AvatarGroup';
import TaskItem from './TaskItem';
import { useTasks } from '../hooks/useTasks';

export default function DashboardOverview() {
  const { 
    tasksToday, tasksTomorrow, activeTab, setActiveTab, 
    addTaskToday, addTaskTomorrow, removeTaskToday, removeTaskTomorrow 
  } = useTasks();

  const [isAdding, setIsAdding] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', desc: '', when: 'today' });

  const handleAddTask = (e) => {
    e.preventDefault();
    if(!newTask.title.trim()) return;
    
    const colors = ['#ff3d6a', '#3b5998', '#5533ff', '#14a800', '#ff9b44', '#77428f'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    const initial = newTask.title.charAt(0).toUpperCase();
    
    const taskData = {
      id: Date.now(),
      title: newTask.title,
      desc: newTask.desc || 'Assigned just now',
      color,
      initial
    };

    if(newTask.when === 'today') {
      addTaskToday(taskData);
    } else {
      addTaskTomorrow(taskData);
    }
    
    setIsAdding(false);
    setNewTask({ title: '', desc: '', when: 'today' });
  };

  return (
    <main className="flex-1 bg-white rounded-t-[3rem] rounded-b-[2rem] shadow-xl shadow-slate-200/50 flex flex-col overflow-hidden relative">
      <div className="absolute inset-0 bg-leaf-pattern opacity-30 pointer-events-none"></div>

      <div className="p-10 flex-1 overflow-y-auto relative z-10 w-full max-w-4xl mx-auto">
        
        {/* HEADER */}
        <header className="flex justify-between items-start mb-10 w-full">
          <div>
            <h2 className="text-[28px] font-extrabold text-black mb-1 tracking-tight">Welcome to Planti.</h2>
            <p className="text-slate-400 font-medium">Hello Shakir, welcome back!</p>
          </div>
          <div className="relative flex items-center">
            <div className="relative">
              <i className="ph ph-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
              <input type="text" placeholder="Search Dashboard" className="bg-slate-50 border-none rounded-2xl pl-10 pr-4 py-3 text-sm focus:ring-2 focus:ring-slate-200 w-64 placeholder-slate-400 font-medium" />
              <i className="ph ph-faders absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
            </div>
            <button onClick={() => setIsAdding(true)} className="ml-4 bg-brand-purple-800 text-white px-4 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-brand-purple-900 transition-colors shadow-md text-sm">
              <i className="ph ph-plus-circle text-lg"></i> Add Task
            </button>
          </div>
        </header>

        {/* HERO CARDS */}
        <div className="grid grid-cols-2 gap-6 mb-12">
          {/* Orange Card */}
          <div className="bg-gradient-to-br from-brand-orange-500 to-brand-orange-600 rounded-[2rem] p-6 text-white shadow-lg shadow-orange-500/20 relative overflow-hidden h-[180px] flex flex-col justify-between cursor-pointer group hover:-translate-y-1 transition-transform">
            <div className="absolute -right-4 -top-8 w-32 h-32 bg-white/10 rounded-full blur-xl group-hover:bg-white/20 transition-colors"></div>
            
            <div className="flex justify-between items-start relative z-10">
              <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-md">
                 <i className="ph-fill ph-lightbulb text-xl"></i>
              </div>
              <button className="text-white/70 hover:text-white"><i className="ph ph-dots-three text-xl"></i></button>
            </div>

            <div className="relative z-10 mt-auto flex justify-between items-end">
               <div>
                 <h3 className="font-extrabold text-2xl leading-tight mb-2 max-w-[200px]">R&D for New Banking Mobile App</h3>
                 <AvatarGroup />
               </div>
            </div>
          </div>

          {/* Purple Card */}
          <div className="bg-gradient-to-br from-[#77428f] to-[#4c2162] rounded-[2rem] p-6 text-white shadow-lg shadow-purple-900/20 relative overflow-hidden h-[180px] flex flex-col justify-between cursor-pointer group hover:-translate-y-1 transition-transform">
             
            <div className="flex justify-between items-start relative z-10">
              <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-md">
                 <i className="ph-fill ph-key text-xl"></i>
              </div>
            </div>

            <div className="relative z-10 mt-auto flex justify-between items-end">
               <div>
                 <h3 className="font-extrabold text-2xl leading-tight mb-2 max-w-[180px]">Create Signup Page</h3>
                 <AvatarGroup />
               </div>
            </div>

            {/* Donut Chart visual */}
            <div className="absolute right-4 top-1/2 -translate-y-1/2 w-32 h-32 pointer-events-none">
               <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                  <path className="text-white/10" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="6" />
                  <path className="text-emerald-400 donut-segment" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="6" />
               </svg>
               <div className="absolute inset-0 flex items-center justify-center">
                  <span className="font-bold text-xl">47%</span>
               </div>
            </div>
          </div>
        </div>

        {/* TABS */}
        <div className="flex items-center border-b border-slate-100 mb-8 relative">
          <button 
            onClick={() => setActiveTab('active')}
            className={`px-6 py-3 font-bold ${activeTab === 'active' ? 'text-brand-purple-800 border-b-2 border-brand-purple-800 -mb-px' : 'text-slate-400 hover:text-slate-600'}`}
          >
            Active Tasks
          </button>
          <button 
            onClick={() => setActiveTab('completed')}
            className={`px-6 py-3 font-bold ${activeTab === 'completed' ? 'text-brand-purple-800 border-b-2 border-brand-purple-800 -mb-px' : 'text-slate-400 hover:text-slate-600'}`}
          >
            Completed
          </button>
          
          <button className="ml-auto flex items-center gap-2 text-slate-400 font-medium px-4">
            <i className="ph ph-magnifying-glass"></i> Search
          </button>
        </div>

        {/* TASKS LIST */}
        <div className="space-y-8">
          {activeTab === 'active' ? (
             <>
                {/* Today Section */}
                {tasksToday.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 mb-4 px-2 uppercase tracking-wide">Today</h4>
                    <div className="flex flex-col gap-4">
                      {tasksToday.map(task => <TaskItem key={task.id} task={task} onDelete={removeTaskToday} />)}
                    </div>
                  </div>
                )}

                {/* Tomorrow Section */}
                {tasksTomorrow.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 mb-4 px-2 uppercase tracking-wide">Tomorrow</h4>
                    <div className="flex flex-col gap-4">
                      {tasksTomorrow.map(task => <TaskItem key={task.id} task={task} onDelete={removeTaskTomorrow} />)}
                    </div>
                  </div>
                )}

                {tasksToday.length === 0 && tasksTomorrow.length === 0 && (
                   <p className="text-center text-slate-400 py-10">No active tasks.</p>
                )}
             </>
          ) : (
             <div className="py-10 text-center text-slate-400">
               <p>No completed tasks yet.</p>
             </div>
          )}
        </div>

      </div>

      {/* ADD TASK MODAL OVERLAY */}
      {isAdding && (
        <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md p-8 shadow-2xl relative">
            <button onClick={() => setIsAdding(false)} className="absolute top-6 right-6 text-slate-400 hover:text-black">
               <i className="ph ph-x text-xl font-bold"></i>
            </button>
            <h3 className="text-2xl font-extrabold mb-6 text-black">New Task</h3>
            <form onSubmit={handleAddTask} className="flex flex-col gap-5">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block">Task Title</label>
                <input required autoFocus type="text" value={newTask.title} onChange={e => setNewTask({...newTask, title: e.target.value})} className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 font-bold text-black focus:ring-2 focus:ring-brand-purple-800" placeholder="e.g. Design Landing Page" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block">Description</label>
                <input type="text" value={newTask.desc} onChange={e => setNewTask({...newTask, desc: e.target.value})} className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 font-medium text-slate-600 focus:ring-2 focus:ring-brand-purple-800" placeholder="e.g. Due next week" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block">When?</label>
                <div className="flex gap-4">
                   <label className="flex items-center gap-2 cursor-pointer font-bold border rounded-xl px-4 py-2 hover:bg-slate-50 flex-1 justify-center">
                     <input type="radio" name="when" value="today" checked={newTask.when === 'today'} onChange={e => setNewTask({...newTask, when: e.target.value})} className="accent-brand-purple-800" /> Today
                   </label>
                   <label className="flex items-center gap-2 cursor-pointer font-bold border rounded-xl px-4 py-2 hover:bg-slate-50 flex-1 justify-center">
                     <input type="radio" name="when" value="tomorrow" checked={newTask.when === 'tomorrow'} onChange={e => setNewTask({...newTask, when: e.target.value})} className="accent-brand-purple-800" /> Tomorrow
                   </label>
                </div>
              </div>
              <button type="submit" className="w-full bg-brand-purple-800 text-white font-bold py-4 rounded-xl mt-4 hover:bg-brand-purple-900 transition-colors shadow-md">
                Create Task
              </button>
            </form>
          </div>
        </div>
      )}

    </main>
  );
}
