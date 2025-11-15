import { useContext, useEffect, useState } from "react";
import { Plus, Users, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import CreateSuccessModal from './CreateSuccessModal.jsx';
import { UserContext } from "../contexts/userContext.jsx";
import axios from "axios";


function HeroSection({fetchClasses}){
  const navigate = useNavigate();
  // get user details - 
  const {user} = useContext(UserContext);


  // state for the "join existing class" input
  const [accessCode,setAccessCode]=useState("");
  // new state for the "create new class" input
  const [createName,setCreateName]=useState(""); 
  // state for showing the success modal
  const [showModal,setShowModal]=useState(false);


  // state to store new group info
  const [newGroupName,setNewGroupName]=useState("");
  const [newAccessCode,setNewAccessCode]=useState("");

  // creation logic and show the modal
  async function handleCreateClass(){
    if(createName.trim()===""){
      alert("Please enter a group name.");
      return;
    }
    
    try {
        const res = await axios.post(
            `${import.meta.env.VITE_DB_LINK}/api/groups/create`, 
            {username : user.username, groupname : createName }, 
            {withCredentials : true}
        );

       
        if (res.data && res.data.group && res.data.group.accessCode) {
            // real data from the successful response
            const realGroupName = res.data.group.groupName;
            const realAccessCode = res.data.group.accessCode; 

            // Save the real 
            setNewGroupName(realGroupName);
            setNewAccessCode(realAccessCode);
            setShowModal(true);
            setCreateName("");
            fetchClasses();
            
        } else {
            //case where server responds successfully but data is missing
            alert("Class created, but access code was not returned by the server.");
            setCreateName("");
            fetchClasses();
        }

    } catch (err) {
      // error responses from the server
      const errorMessage = err.response?.data?.message || "Failed to create class. Check server connection.";
      alert(errorMessage);
    }
  };

  // Function to handle joining an existing class
 
  async function handleJoinClass() {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_DB_LINK}/api/groups/join`,
        { username: user.username, accesscode: accessCode },
        { withCredentials: true }
      );
      
      alert("Successfully joined the class!");
      navigate(`/groups/${res.data.groupid}`);
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Failed to join the class";
      alert(errorMessage);
    }
  }


  return(
    <div className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300 group">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Plus className="w-8 h-8 text-white"/>
              </div>
              <h3 className="text-2xl font-semibold mb-4">Create New Class</h3>
              <p className="text-purple-200 mb-6">Start a new study class and invite others to join</p>
              <div className="space-y-4">
                <div className="relative">
                  <input type="text" placeholder="Enter Group Name" value={createName} onChange={e=>setCreateName(e.target.value)} className="w-full bg-white/20 border border-white/30 rounded-xl py-3 px-4 text-white placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all duration-300"/>
                </div>
                <button onClick={handleCreateClass} className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg">
                  Create Class
                </button>
              </div>
            </div>
          </div>
          {/* join class card - unmodified */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300 group">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Users className="w-8 h-8 text-white"/>
              </div>
              <h3 className="text-2xl font-semibold mb-4">Join Existing Class</h3>
              <p className="text-purple-200 mb-6">Enter a class access code to join an class</p>
              <div className="space-y-4">
                <div className="relative">
                  <input type="text" placeholder="Enter Group Code" value={accessCode} onChange={e=>setAccessCode(e.target.value)} className="w-full bg-white/20 border border-white/30 rounded-xl py-3 px-4 text-white placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300"/>
                  <Search className="absolute right-3 top-3 w-5 h-5 text-purple-200"/>
                </div>
                <button onClick={()=>handleJoinClass()} className="w-full bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg">Join Class</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* success modal */}
      {showModal && (
        <CreateSuccessModal groupName={newGroupName} accessCode={newAccessCode} onClose={()=>setShowModal(false)}/>
      )}
    </div>
  );
}


function ClassNav({ activeTab, setActiveTab }) {
  const activeNavStyle =
    "text-white bg-fuchsia-600 border-1 font-semibold py-2 px-4 rounded-lg cursor-pointer hover:bg-fuchsia-700";
  const navStyle =
    "text-gray-900 border-1 font-semibold py-2 px-4 rounded-lg cursor-pointer bg-white hover:bg-fuchsia-600 hover:text-white";
  return (
    <>
      <div className="max-w-6xl mx-auto py-6 flex gap-[15px] items-center">
        <div
          className={activeTab === "active" ? activeNavStyle : navStyle}
          onClick={() => setActiveTab("active")}
        >
          Active Classes
        </div>
        {/*
        for future use - couldnt do due to time constraints !
        <div
          className={activeTab === "completed" ? activeNavStyle : navStyle}
          onClick={() => setActiveTab("completed")}
        >
          Completed Classes
        </div>
        <div
          className={activeTab === "your" ? activeNavStyle : navStyle}
          onClick={() => setActiveTab("your")}
        >
          Your Classes
        </div>
        <div
          className={activeTab === "joined" ? activeNavStyle : navStyle}
          onClick={() => setActiveTab("joined")}
        >
          Joined Classes
        </div> */}
      </div>
    </>
  );
}

function ClassList({classes, loading, activeTab, setActiveTab}) {
  
  const navigate = useNavigate();

  // kankaalllll
  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-gray-100 rounded-2xl p-6 animate-pulse">
              <div className="h-4 bg-gray-300 rounded mb-4"></div>
              <div className="h-3 bg-gray-300 rounded mb-2"></div>
              <div className="h-3 bg-gray-300 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-3">
      <div className="max-w-6xl mx-auto px-6">
        <ClassNav activeTab={activeTab} setActiveTab={setActiveTab} />
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            {activeTab === "active"
              ? "Active Classes"
              : activeTab === "completed"
              ? "Completed Classes"
              : activeTab === "your"
              ? "Your Classes"
              : "Joined Classes"}
          </h2>
          <p className="text-gray-600">
            {activeTab === "active"
              ? "Curently Live Classes"
              : activeTab === "completed"
              ? "Previously Completed Classes"
              : activeTab === "your"
              ? "Classes you created"
              : "Classes you joined"}
          </p>
        </div>

        {classes.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No Classes
            </h3>
            <p className="text-gray-600 mb-6">
              Create a class
            </p>
            <button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300">
              Create Class
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {classes.map((classItem) => (
              <div
                key={classItem.id}
                onClick={() => navigate(`/groups/${classItem.id}`)}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden group cursor-pointer"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-1 group-hover:text-purple-600 transition-colors duration-300">
                        {classItem.groupName}
                      </h3>
                      
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <p className="text-gray-400 font-bold">{classItem.faculty}</p>
                    <button className="text-purple-600 hover:text-purple-700 font-medium text-sm transition-colors duration-300">
                      View →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Dashboard() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("active");

  const fetchClasses = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_DB_LINK}/api/groups/all`, {withCredentials : true});
        const data = response.data;

        // console.log("Fetched classes:", data.groups);
        
        setClasses(data.groups);
        setLoading(false);

        console.log(data);
        
      } catch (error) {
        console.error("Failed to fetch classes:", error);
        setLoading(false);
      }
    };

  useEffect(() => {
    fetchClasses();
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-gray-50">
      <HeroSection fetchClasses={fetchClasses}/>
      <ClassList classes={classes} loading={loading} activeTab={activeTab} setLoading={setLoading} setClasses={setClasses} setActiveTab={setActiveTab} />
    </div>
  );
}

export default Dashboard;
