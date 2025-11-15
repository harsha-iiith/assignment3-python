import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Plus, Video, Users, Clock, Calendar, Play, Pause, MessageCircle, LogOut } from 'lucide-react';

export function FacultyDashboard({ onGoLive, onSignOut }) {
  const [classes, setClasses] = useState([
    {
      id: '1',
      name: 'Advanced Mathematics',
      description: 'Calculus and Linear Algebra',
      faculty: 'Dr. Smith',
      time: '10:00 AM',
      date: 'Today',
      participants: 24,
      isLive: false,
      isOwner: true
    },
    {
      id: '2',
      name: 'Physics Lab',
      description: 'Quantum Mechanics Experiments',
      faculty: 'Dr. Johnson',
      time: '2:00 PM',
      date: 'Today',
      participants: 18,
      isLive: true,
      isOwner: false
    },
    {
      id: '3',
      name: 'Computer Science',
      description: 'Data Structures and Algorithms',
      faculty: 'Prof. Wilson',
      time: '11:00 AM',
      date: 'Tomorrow',
      participants: 32,
      isLive: false,
      isOwner: false
    }
  ]);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newClassName, setNewClassName] = useState('');
  const [newClassDescription, setNewClassDescription] = useState('');

  const handleCreateClass = () => {
    if (newClassName.trim()) {
      const newClass = {
        id: Date.now().toString(),
        name: newClassName,
        description: newClassDescription,
        faculty: 'You',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        date: 'Today',
        participants: 0,
        isLive: false,
        isOwner: true
      };
      
      setClasses([newClass, ...classes]);
      setNewClassName('');
      setNewClassDescription('');
      setShowCreateModal(false);
    }
  };

  const handleGoLive = (classId) => {
    setClasses(classes.map(cls => 
      cls.id === classId ? { ...cls, isLive: true } : cls
    ));
    onGoLive(classId);
  };

  const handleStopLive = (classId) => {
    setClasses(classes.map(cls => 
      cls.id === classId ? { ...cls, isLive: false } : cls
    ));
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-foreground">Faculty Dashboard</h1>
            <p className="text-muted-foreground mt-1">Manage your classes and view global schedule</p>
          </div>
          <div className="flex items-center gap-3">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button 
                onClick={() => setShowCreateModal(true)}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Classroom
              </Button>
            </motion.div>
            <Button 
              onClick={onSignOut}
              variant="outline"
              className="border-border text-foreground"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-card border-border">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Video className="w-8 h-8 text-primary" />
                  <div className="ml-4">
                    <p className="text-sm text-muted-foreground">Active Classes</p>
                    <p className="text-2xl font-semibold text-card-foreground">
                      {classes.filter(c => c.isLive).length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-card border-border">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Users className="w-8 h-8 text-primary" />
                  <div className="ml-4">
                    <p className="text-sm text-muted-foreground">Total Students</p>
                    <p className="text-2xl font-semibold text-card-foreground">
                      {classes.reduce((sum, c) => sum + c.participants, 0)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-card border-border">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Calendar className="w-8 h-8 text-primary" />
                  <div className="ml-4">
                    <p className="text-sm text-muted-foreground">My Classes</p>
                    <p className="text-2xl font-semibold text-card-foreground">
                      {classes.filter(c => c.isOwner).length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Classes Grid */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground">All Scheduled Classes</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            <AnimatePresence>
              {classes.map((classItem, index) => (
                <motion.div
                  key={classItem.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="bg-card border-border hover:border-primary/30 transition-colors">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg text-card-foreground">{classItem.name}</CardTitle>
                          <p className="text-sm text-muted-foreground mt-1">{classItem.description}</p>
                        </div>
                        {classItem.isLive && (
                          <Badge variant="secondary" className="bg-primary/20 text-primary border-primary/30">
                            <div className="w-2 h-2 bg-primary rounded-full mr-2 animate-pulse"></div>
                            LIVE
                          </Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center text-muted-foreground">
                            <Avatar className="w-6 h-6 mr-2">
                              <AvatarFallback className="text-xs">
                                {classItem.faculty.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            {classItem.faculty}
                          </div>
                          <div className="flex items-center text-muted-foreground">
                            <Users className="w-4 h-4 mr-1" />
                            {classItem.participants}
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {classItem.time}
                          </div>
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            {classItem.date}
                          </div>
                        </div>

                        {classItem.isOwner && (
                          <div className="pt-2 border-t border-border">
                            {!classItem.isLive ? (
                              <Button 
                                onClick={() => handleGoLive(classItem.id)}
                                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                                size="sm"
                              >
                                <Play className="w-4 h-4 mr-2" />
                                Go Live
                              </Button>
                            ) : (
                              <div className="flex gap-2">
                                <Button 
                                  onClick={() => handleStopLive(classItem.id)}
                                  variant="outline"
                                  className="flex-1 border-border text-card-foreground"
                                  size="sm"
                                >
                                  <Pause className="w-4 h-4 mr-2" />
                                  Stop
                                </Button>
                                <Button 
                                  onClick={() => onGoLive(classItem.id)}
                                  className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                                  size="sm"
                                >
                                  <MessageCircle className="w-4 h-4 mr-2" />
                                  View Questions
                                </Button>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Create Classroom Modal */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-card-foreground">Create New Classroom</DialogTitle>
          </DialogHeader>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div>
              <label className="text-sm text-card-foreground mb-2 block">Classroom Name</label>
              <Input
                value={newClassName}
                onChange={(e) => setNewClassName(e.target.value)}
                placeholder="Enter classroom name"
                className="bg-input-background border-border text-card-foreground"
              />
            </div>
            <div>
              <label className="text-sm text-card-foreground mb-2 block">Description</label>
              <Textarea
                value={newClassDescription}
                onChange={(e) => setNewClassDescription(e.target.value)}
                placeholder="Enter classroom description"
                className="bg-input-background border-border text-card-foreground"
                rows={3}
              />
            </div>
            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setShowCreateModal(false)}
                className="flex-1 border-border text-card-foreground"
              >
                Cancel
              </Button>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1"
              >
                <Button
                  onClick={handleCreateClass}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                  disabled={!newClassName.trim()}
                >
                  Create Classroom
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </DialogContent>
      </Dialog>
    </div>
  );
}