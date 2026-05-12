import React from 'react';
import AvatarGroup from './AvatarGroup';

export default function TaskItem({ task, onDelete }) {
  return (
    <div className="flex items-center gap-4 bg-white hover:bg-slate-50 p-2 rounded-2xl transition-colors cursor-pointer group">
      <div 
        className="w-14 h-14 rounded-[1.25rem] text-white flex items-center justify-center font-bold text-xl shadow-md shrink-0" 
        style={{ backgroundColor: task.color || '#3b5998' }}
      >
        {typeof task.initial === 'string' ? task.initial : <i className={`ph-fill ${task.initial || 'ph-app-window'}`}></i>}
      </div>
      <div className="flex-1 min-w-0">
        <h5 className="font-extrabold text-base text-text-main leading-tight mb-1 truncate">{task.title}</h5>
        <p className="text-xs text-slate-400 font-medium truncate">{task.desc}</p>
      </div>
      <div className="px-4 opacity-70 group-hover:opacity-100 transition-opacity shrink-0 hidden sm:block">
         <AvatarGroup className="scale-90" />
      </div>
      {onDelete && (
        <button 
          onClick={(e) => { e.stopPropagation(); onDelete(task.id); }}
          className="opacity-0 group-hover:opacity-100 p-2 text-slate-400 hover:text-red-500 transition-all rounded-xl hover:bg-red-50 shrink-0"
        >
          <i className="ph ph-trash text-lg"></i>
        </button>
      )}
    </div>
  );
}
