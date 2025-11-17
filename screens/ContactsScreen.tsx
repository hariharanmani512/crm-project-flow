import React, { useState } from 'react';
import { Contact, Profile, Institution, AcademicYear, AcademicSession } from '../types';
import { PlusCircle, Phone, Mail, FileText, UserCircle, Users, Edit, Trash2 } from '../components/icons/Icons';
import AddContactModal from '../components/AddContactModal';

interface ContactsScreenProps {
    currentUserProfile: Profile;
    contacts: Contact[];
    onUpdateContacts: (contacts: Contact[]) => void;
    onMoveToLead: (contact: Contact) => void;
    institutions: Institution[];
    academicYears: AcademicYear[];
    academicSessions: AcademicSession[];
}

const ContactCard: React.FC<{ contact: Contact; onSelect: (contact: Contact) => void; isSelected: boolean }> = ({ contact, onSelect, isSelected }) => (
    <div
        onClick={() => onSelect(contact)}
        className={`p-4 rounded-lg cursor-pointer transition-all duration-200 flex items-center space-x-4 ${
            isSelected ? 'bg-primary-light shadow-md' : 'bg-white hover:bg-gray-50'
        }`}
    >
        <div className="w-10 h-10 rounded-full bg-neutral-200 flex items-center justify-center flex-shrink-0">
            <UserCircle className="w-6 h-6 text-neutral-500"/>
        </div>
        <div>
            <p className="font-semibold text-neutral-800">{contact.name}</p>
            <p className="text-sm text-neutral-400">{contact.phone}</p>
        </div>
    </div>
);

const ActivityIcon: React.FC<{type: 'Call' | 'Email' | 'Note' | 'Meeting'}> = ({type}) => {
    const baseClass = "w-4 h-4 text-neutral-500";
    switch(type) {
        case 'Call': return <Phone className={baseClass} />;
        case 'Email': return <Mail className={baseClass} />;
        case 'Note': return <FileText className={baseClass} />;
        case 'Meeting': return <Users className={baseClass} />;
        default: return <FileText className={baseClass} />;
    }
}

const ContactDetail: React.FC<{ 
    contact: Contact | null; 
    permissions: Profile['permissions']['contacts']; 
    onDelete: (contactId: number) => void; 
    onMoveToLead: (contact: Contact) => void;
}> = ({ contact, permissions, onDelete, onMoveToLead }) => {
    if (!contact) {
        return (
            <div className="flex flex-col items-center justify-center h-full bg-white rounded-xl shadow-md p-6 text-center">
                <UserCircle className="w-16 h-16 text-neutral-200" />
                <p className="mt-4 text-lg font-medium text-neutral-600">Select a contact to view details</p>
                <p className="text-neutral-400">You can view their activity history and manage information.</p>
            </div>
        );
    }
    
    const handleDelete = () => {
        if (window.confirm(`Are you sure you want to delete ${contact.name}?`)) {
            onDelete(contact.id);
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-md p-6 flex flex-col h-full overflow-y-auto">
            <div className="border-b pb-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <div className="w-16 h-16 rounded-full bg-primary-light flex items-center justify-center text-primary text-2xl font-bold mr-4">
                            {contact.name.charAt(0)}
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold text-neutral-800">{contact.name}</h3>
                            <p className="text-neutral-400">{contact.phone}</p>
                        </div>
                    </div>
                     <div className="flex space-x-2">
                        {permissions.update && <button className="p-2 text-neutral-500 hover:bg-neutral-100 rounded-lg"><Edit className="w-5 h-5"/></button>}
                        {permissions.delete && <button onClick={handleDelete} className="p-2 text-red-500 hover:bg-red-100 rounded-lg"><Trash2 className="w-5 h-5"/></button>}
                    </div>
                </div>
                 <div className="mt-4">
                     <button 
                        onClick={() => onMoveToLead(contact)}
                        className="w-full text-sm flex items-center justify-center py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition"
                     >
                        Move to Lead
                    </button>
                 </div>
            </div>

            <div className="py-4 border-b text-sm">
                <h4 className="font-semibold text-neutral-600 mb-2">Details</h4>
                <p><strong>Email:</strong> {contact.email || 'N/A'}</p>
                <p><strong>Institution:</strong> {contact.institution.name}</p>
                <p><strong>Academic Year:</strong> {contact.academicYear.name}</p>
                <p><strong>Created:</strong> {contact.createdDate}</p>
            </div>

            <div className="flex-1 py-4">
                <h4 className="font-semibold text-neutral-600 mb-4">Activity Timeline</h4>
                <div className="space-y-4">
                    {contact.activities.length > 0 ? contact.activities.map(activity => (
                        <div key={activity.id} className="flex items-start text-sm">
                            <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center mr-3 flex-shrink-0">
                                <ActivityIcon type={activity.type} />
                            </div>
                            <div>
                                <p className="text-neutral-800">{activity.notes}</p>
                                <p className="text-xs text-neutral-400">{activity.createdBy} - {activity.date}</p>
                            </div>
                        </div>
                    )) : (
                        <p className="text-sm text-neutral-400 text-center py-4">No activities logged for this contact.</p>
                    )}
                </div>
            </div>
        </div>
    );
};


const ContactsScreen: React.FC<ContactsScreenProps> = (props) => {
    const { currentUserProfile, contacts, onUpdateContacts, onMoveToLead, ...dynamicData } = props;
    const [selectedContact, setSelectedContact] = useState<Contact | null>(contacts[0] || null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    const permissions = currentUserProfile.permissions.contacts;

    const handleAddContact = (newContactData: Omit<Contact, 'id' | 'activities'>) => {
        const newContact: Contact = {
            id: contacts.length > 0 ? Math.max(...contacts.map(c => c.id)) + 1 : 1,
            ...newContactData,
            activities: [{
                id: 1,
                date: newContactData.createdDate,
                type: 'Note',
                notes: 'Contact created.',
                createdBy: 'System'
            }]
        };
        const updatedContacts = [newContact, ...contacts];
        onUpdateContacts(updatedContacts);
        setSelectedContact(newContact);
    };

    const handleDeleteContact = (contactId: number) => {
        const updatedContacts = contacts.filter(c => c.id !== contactId);
        onUpdateContacts(updatedContacts);
        setSelectedContact(updatedContacts[0] || null);
    };

  return (
    <>
      {isModalOpen && <AddContactModal 
        onClose={() => setIsModalOpen(false)} 
        onAddContact={handleAddContact} 
        {...dynamicData}
      />}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-8rem)]">
          <div className="lg:col-span-1 bg-neutral-100 p-4 rounded-xl shadow-inner overflow-y-auto">
              <div className="flex justify-between items-center mb-4 px-2">
                  <h3 className="font-semibold text-lg">All Contacts ({contacts.length})</h3>
                   {permissions.create && (
                    <button onClick={() => setIsModalOpen(true)} className="flex items-center bg-primary text-white px-3 py-2 text-sm rounded-lg hover:bg-primary-dark transition">
                        <PlusCircle className="w-4 h-4 mr-2" />
                        Add
                    </button>
                   )}
              </div>
              <div className="space-y-2">
                  {contacts.map(contact => (
                      <ContactCard 
                          key={contact.id} 
                          contact={contact} 
                          onSelect={setSelectedContact} 
                          isSelected={selectedContact?.id === contact.id}
                      />
                  ))}
              </div>
          </div>
          <div className="lg:col-span-2">
              <ContactDetail 
                contact={selectedContact} 
                permissions={permissions} 
                onDelete={handleDeleteContact} 
                onMoveToLead={onMoveToLead}
              />
          </div>
      </div>
    </>
  );
};

export default ContactsScreen;