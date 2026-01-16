/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import { useState, useEffect } from 'react';
import { 
  User, Shield, Plus, Trash2, Users, RefreshCw, CheckCircle, 
  Edit, Bell, Settings, AlertCircle 
} from 'lucide-react';
import { toast } from 'react-hot-toast';

// Hooks & Types réels (ceux que tu m'as montrés)
import { 
  useOrganizationProfile, 
  useUpdateOrganizationProfile, 
  useUpdateOrganizationPassword,
  useOrganizationMembers,
  useAddOrganizationMember,
  useRemoveOrganizationMember,
  useUpdateOrganizationMember
} from '@/hooks/useOrganizations';
import { OrganizationMember, UpdateMemberDto } from '@/types/organization';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'account' | 'team' | 'notifications' | 'security' | 'appearance'>('account');
  const [showInviteModal, setShowInviteModal] = useState(false);

  // --- Données API ---
  const { data: profile, isLoading: isProfileLoading } = useOrganizationProfile();
  const { data: members, isLoading: isMembersLoading } = useOrganizationMembers();
  
  // --- Mutations API ---
  const updateProfile = useUpdateOrganizationProfile();
  const updatePassword = useUpdateOrganizationPassword();
  const addMember = useAddOrganizationMember();
  const removeMember = useRemoveOrganizationMember();
  const updateMember = useUpdateOrganizationMember();

  // --- État Local Formulaire Account ---
  // Initialisé avec les données du profil quand elles arrivent
  const [accountForm, setAccountForm] = useState({
    name: '',
    phone: '',
    address: '',
    description: ''
  });

  useEffect(() => {
    if (profile) {
      setAccountForm({
        name: profile.name || '',
        phone: profile.phone || '',
        address: profile.address || '',
        description: profile.description || ''
      });
    }
  }, [profile]);

  // --- Handlers ---

  const handleSaveAccount = async () => {
    // On n'envoie que ce qui est nécessaire selon UpdateOrganizationDto
    await updateProfile.mutateAsync({
      name: accountForm.name,
      phone: accountForm.phone,
      address: accountForm.address,
      description: accountForm.description
    });
  };

  const handleToggleMember = (member: OrganizationMember) => {
    // Utilise exactement la structure attendue par ton hook useUpdateOrganizationMember
    updateMember.mutate({ 
      id: member.id, 
      data: { isActive: !member.isActive } 
    });
  };

  if (isProfileLoading) return <div className="flex justify-center p-20"><RefreshCw className="animate-spin" /></div>;

  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* ... Navigation Tabs (Inchangée) ... */}

      <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
        
        {/* SECTION COMPTE */}
        {activeTab === 'account' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Nom de l&apos;établissement</label>
                <input 
                  value={accountForm.name}
                  onChange={(e) => setAccountForm({...accountForm, name: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-50 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Téléphone professionnel</label>
                <input 
                  value={accountForm.phone}
                  onChange={(e) => setAccountForm({...accountForm, phone: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-50 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Description</label>
              <textarea 
                rows={4}
                value={accountForm.description}
                onChange={(e) => setAccountForm({...accountForm, description: e.target.value})}
                className="w-full px-4 py-3 bg-gray-50 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none"
              />
            </div>

            <button 
              onClick={handleSaveAccount}
              disabled={updateProfile.isPending}
              className="w-full py-4 bg-teal-600 text-white font-bold rounded-2xl hover:bg-teal-700 flex items-center justify-center gap-2"
            >
              {updateProfile.isPending ? <RefreshCw className="h-5 w-5 animate-spin" /> : <CheckCircle className="h-5 w-5" />}
              Sauvegarder les modifications
            </button>
          </div>
        )}

        {/* SECTION ÉQUIPE */}
        {activeTab === 'team' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold">Membres de l&apos;équipe ({members?.length || 0})</h3>
              <button 
                onClick={() => setShowInviteModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-xl font-medium"
              >
                <Plus className="h-5 w-5" /> Inviter un membre
              </button>
            </div>

            <div className="space-y-4">
              {isMembersLoading ? <RefreshCw className="animate-spin mx-auto" /> : (
                members?.map((member) => (
                  <div key={member.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-bold uppercase">
                        {member.firstName[0]}{member.lastName[0]}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">{member.firstName} {member.lastName}</p>
                        <p className="text-sm text-gray-500">{member.email} • <span className="text-teal-600">{member.position || 'Membre'}</span></p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => handleToggleMember(member)}
                        className={`px-3 py-1 rounded-lg text-xs font-bold ${member.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'}`}
                      >
                        {member.isActive ? 'Actif' : 'Inactif'}
                      </button>
                      <button 
                        onClick={() => removeMember.mutate(member.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* SECTION SÉCURITÉ */}
        {activeTab === 'security' && (
          <div className="max-w-md space-y-6">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <Shield className="text-teal-600" /> Modifier le mot de passe
            </h3>
            {/* ... Formulaire Password (Inchangé mais lié à updatePassword.mutateAsync) ... */}
          </div>
        )}

      </div>
      
      {/* Zone de Danger - Action de suppression de l'organisation (non définie dans tes hooks actuels) */}
      <div className="mt-8 p-6 bg-red-50 rounded-3xl border border-red-100">
        <h3 className="text-red-900 font-bold flex items-center gap-2 mb-2">
          <AlertCircle className="h-5 w-5" /> Zone de danger
        </h3>
        <p className="text-red-700 text-sm mb-4">La suppression du compte est irréversible. Toutes vos données seront effacées.</p>
        <button className="px-6 py-2 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700">
          Supprimer l&apos;organisation
        </button>
      </div>
    </div>
  );
}