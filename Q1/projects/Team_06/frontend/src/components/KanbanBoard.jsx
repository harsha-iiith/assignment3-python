import Card from "./Card";

function Column({ title, items = [] }) {
  return (
    <div className="min-w-0 bg-white/60 backdrop-blur-sm rounded-2xl shadow-xl p-6 flex flex-col border border-white/30 h-full overflow-hidden">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-slate-800">
          {title}
        </h2>
        <span className="text-xs font-normal text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
          {items.length}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 space-y-6 scrollbar-hide">
        {items.map((it) => (
          <Card key={it._id} item={it} />
        ))}
      </div>
    </div>
  );
}

export default function KanbanBoard({ items = [] }) {
  // Filter data based on status
  const getFilteredData = (filterType) => {
    switch (filterType) {
      case "unanswered":
        return items.filter(item => item.status === "unanswered");
      case "answered":
        return items.filter(item => item.status === "answered");
      case "important":
        return items.filter(item => item.status === "important");
      default:
        return items;
    }
  };

  return (
    <div className="h-full grid grid-cols-1 md:grid-cols-3 gap-6">
      <Column title="Unanswered" items={getFilteredData("unanswered")} />
      <Column title="Answered" items={getFilteredData("answered")} />
      <Column title="Important" items={getFilteredData("important")} />
    </div>
  );
}
