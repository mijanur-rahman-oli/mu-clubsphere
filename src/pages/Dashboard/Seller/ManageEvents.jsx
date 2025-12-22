import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { Plus, Edit, Eye, Trash2, X, Loader2 } from 'lucide-react';

const ManageEvents = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);

  const [formData, setFormData] = useState({
    clubId: '',
    title: '',
    description: '',
    eventDate: '',
    location: '',
    isPaid: false,
    eventFee: 0,
    maxAttendees: '',
  });

  // Fetch manager's clubs
  const { data: clubs = [], isLoading: clubsLoading } = useQuery({
    queryKey: ['manager-clubs'],
    queryFn: async () => {
      const res = await axiosSecure.get('/manager/clubs');
      return res.data;
    },
  });

  // Fetch manager's events only (filtered by their clubs)
  const { data: events = [], isLoading: eventsLoading } = useQuery({
    queryKey: ['manager-events'],
    queryFn: async () => {
      // First get manager's club IDs
      const clubsRes = await axiosSecure.get('/manager/clubs');
      const clubIds = clubsRes.data.map(club => club._id);

      if (clubIds.length === 0) return [];

      // Fetch all events and filter client-side (or better: make backend endpoint /manager/events)
      const allEventsRes = await axiosSecure.get('/events');
      return allEventsRes.data.filter(event => clubIds.includes(event.clubId));
    },
  });

  const createMutation = useMutation({
    mutationFn: (newEvent) => axiosSecure.post('/events', newEvent),
    onSuccess: () => {
      queryClient.invalidateQueries(['manager-events']);
      queryClient.invalidateQueries(['manager-clubs']);
      toast.success('Event created successfully!');
      closeForm();
    },
    onError: (err) => {
      toast.error(err.response?.data?.error || 'Failed to create event');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, updatedEvent }) => axiosSecure.patch(`/events/${id}`, updatedEvent),
    onSuccess: () => {
      queryClient.invalidateQueries(['manager-events']);
      toast.success('Event updated successfully!');
      closeForm();
    },
    onError: (err) => {
      toast.error(err.response?.data?.error || 'Failed to update event');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => axiosSecure.delete(`/events/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(['manager-events']);
      toast.success('Event deleted successfully!');
    },
    onError: (err) => {
      toast.error(err.response?.data?.error || 'Cannot delete event with registrations');
    },
  });

  const closeForm = () => {
    setShowForm(false);
    setEditingEvent(null);
    setFormData({
      clubId: clubs[0]?._id || '',
      title: '',
      description: '',
      eventDate: '',
      location: '',
      isPaid: false,
      eventFee: 0,
      maxAttendees: '',
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.clubId) {
      toast.error('Please select a club');
      return;
    }

    const payload = {
      clubId: formData.clubId,
      title: formData.title.trim(),
      description: formData.description.trim(),
      eventDate: formData.eventDate,
      location: formData.location.trim(),
      isPaid: formData.isPaid,
      eventFee: formData.isPaid ? Number(formData.eventFee) || 0 : 0,
      maxAttendees: formData.maxAttendees ? Number(formData.maxAttendees) : null,
    };

    if (editingEvent) {
      updateMutation.mutate({ id: editingEvent._id, updatedEvent: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const handleEdit = (event) => {
    setEditingEvent(event);
    setFormData({
      clubId: event.clubId,
      title: event.title,
      description: event.description || '',
      eventDate: format(new Date(event.eventDate), 'yyyy-MM-dd'),
      location: event.location || '',
      isPaid: event.isPaid || false,
      eventFee: event.eventFee || 0,
      maxAttendees: event.maxAttendees || '',
    });
    setShowForm(true);
  };

  const handleDelete = (eventId) => {
    if (window.confirm('Are you sure you want to delete this event? This cannot be undone.')) {
      deleteMutation.mutate(eventId);
    }
  };

  if (clubsLoading || eventsLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-gray-800">Manage Events</h2>
          <p className="text-gray-600 mt-1">Create and manage events for your clubs</p>
        </div>

        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="btn btn-primary flex items-center gap-2 shadow-lg hover:shadow-xl transition"
          >
            <Plus size={20} />
            Create New Event
          </button>
        )}
      </div>

      {/* Event Form */}
      {showForm && (
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-8 py-5 flex justify-between items-center">
            <h3 className="text-2xl font-bold text-white">
              {editingEvent ? 'Edit Event' : 'Create New Event'}
            </h3>
            <button
              onClick={closeForm}
              className="text-white hover:bg-white/20 rounded-full p-2 transition"
            >
              <X size={24} />
            </button>
          </div>

          <div className="p-8">
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Title */}
              <div className="md:col-span-2">
                <label className="label font-medium">Event Title <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  required
                  className="input input-bordered w-full"
                  placeholder="e.g., Annual Sports Day"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              {/* Club & Date */}
              <div>
                <label className="label font-medium">Hosting Club <span className="text-red-500">*</span></label>
                <select
                  required
                  className="select select-bordered w-full"
                  value={formData.clubId}
                  onChange={(e) => setFormData({ ...formData, clubId: e.target.value })}
                >
                  <option value="">Select a club</option>
                  {clubs.map((club) => (
                    <option key={club._id} value={club._id}>
                      {club.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="label font-medium">Event Date <span className="text-red-500">*</span></label>
                <input
                  type="date"
                  required
                  className="input input-bordered w-full"
                  value={formData.eventDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                />
              </div>

              {/* Location & Max Attendees */}
              <div>
                <label className="label font-medium">Location <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  required
                  className="input input-bordered w-full"
                  placeholder="e.g., Main Auditorium"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                />
              </div>

              <div>
                <label className="label font-medium">Max Attendees (optional)</label>
                <input
                  type="number"
                  min="1"
                  className="input input-bordered w-full"
                  placeholder="Unlimited if empty"
                  value={formData.maxAttendees}
                  onChange={(e) => setFormData({ ...formData, maxAttendees: e.target.value })}
                />
              </div>

              {/* Paid Event Toggle */}
              <div className="md:col-span-2">
                <label className="label font-medium cursor-pointer flex items-center gap-4">
                  <input
                    type="checkbox"
                    className="checkbox checkbox-primary"
                    checked={formData.isPaid}
                    onChange={(e) => setFormData({ ...formData, isPaid: e.target.checked })}
                  />
                  <span>This is a paid event</span>
                </label>

                {formData.isPaid && (
                  <div className="mt-4">
                    <label className="label font-medium">Entry Fee ($) <span className="text-red-500">*</span></label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      required={formData.isPaid}
                      className="input input-bordered w-full max-w-xs"
                      value={formData.eventFee}
                      onChange={(e) => setFormData({ ...formData, eventFee: e.target.value })}
                    />
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <label className="label font-medium">Description</label>
                <textarea
                  className="textarea textarea-bordered w-full"
                  rows="4"
                  placeholder="Describe the event, schedule, what to bring, etc."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              {/* Buttons */}
              <div className="md:col-span-2 flex gap-4 justify-end mt-6">
                <button
                  type="button"
                  onClick={closeForm}
                  className="btn btn-ghost"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                  className="btn btn-primary flex items-center gap-2"
                >
                  {(createMutation.isPending || updateMutation.isPending) && (
                    <Loader2 className="animate-spin" size={18} />
                  )}
                  {editingEvent ? 'Update Event' : 'Create Event'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Events Table */}
      <div className="bg-white rounded-2xl shadow-xl border overflow-hidden">
        <div className="p-6 border-b">
          <h3 className="text-xl font-semibold">Your Events ({events.length})</h3>
        </div>

        {events.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <p className="text-lg">No events created yet.</p>
            <p className="mt-2">Click "Create New Event" to get started!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th>Event</th>
                  <th>Club</th>
                  <th>Date</th>
                  <th>Attendance</th>
                  <th>Fee</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {events.map((event) => {
                  const clubName = clubs.find(c => c._id === event.clubId)?.name || 'Unknown Club';

                  return (
                    <tr key={event._id} className="hover:bg-gray-50">
                      <td>
                        <div>
                          <p className="font-semibold">{event.title}</p>
                          <p className="text-sm text-gray-600">{event.description?.slice(0, 50)}...</p>
                        </div>
                      </td>
                      <td className="font-medium text-blue-600">{clubName}</td>
                      <td>{format(new Date(event.eventDate), 'PPP')}</td>
                      <td>
                        <span className="badge badge-ghost">
                          {event.registrationsCount || 0} / {event.maxAttendees || '∞'}
                        </span>
                      </td>
                      <td>
                        {event.isPaid ? (
                          <span className="badge badge-success">${event.eventFee}</span>
                        ) : (
                          <span className="badge badge-info">Free</span>
                        )}
                      </td>
                      <td className="text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => navigate(`/dashboard/event-registrations?eventId=${event._id}`)}
                            className="btn btn-ghost btn-sm text-info tooltip"
                            data-tip="View Registrations"
                          >
                            <Eye size={18} />
                          </button>
                          <button
                            onClick={() => handleEdit(event)}
                            className="btn btn-ghost btn-sm text-warning tooltip"
                            data-tip="Edit"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(event._id)}
                            disabled={deleteMutation.isPending}
                            className="btn btn-ghost btn-sm text-error tooltip"
                            data-tip="Delete"
                          >
                            {deleteMutation.isPending ? (
                              <Loader2 className="animate-spin" size={16} />
                            ) : (
                              <Trash2 size={18} />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageEvents;