<script setup lang="ts">
import { reactive, ref, onMounted } from "vue";
import BaseInput from "@/components/ui/BaseInput.vue";
import BaseButton from "@/components/ui/BaseButton.vue";
import BaseModal from "@/components/ui/BaseModal.vue";
import { authService } from "@/services/authService";
import { useAuthStore } from "@/stores/auth";
import { useAuth } from "@/composables/useAuth";
import { useToast } from "@/composables/useToast";

const authStore = useAuthStore();
const { logout } = useAuth();
const toast = useToast();

const profile = reactive({ name: "", email: "" });
const profileLoading = ref(false);
const profileErrors = reactive({ name: "", email: "" });

const pwd = reactive({ current: "", newPwd: "", confirm: "" });
const pwdLoading = ref(false);
const pwdErrors = reactive({ current: "", newPwd: "", confirm: "" });

const deleteModalOpen = ref(false);
const deleteLoading = ref(false);

onMounted(() => {
  profile.name = authStore.user?.name ?? "";
  profile.email = authStore.user?.email ?? "";
});

function validateProfile() {
  profileErrors.name =
    profile.name.trim().length < 2 ? "Name must be at least 2 characters." : "";
  profileErrors.email = !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email)
    ? "Enter a valid email."
    : "";
  return !profileErrors.name && !profileErrors.email;
}

async function saveProfile() {
  if (!validateProfile()) return;
  profileLoading.value = true;
  try {
    const updated = await authService.updateProfile({
      name: profile.name,
      email: profile.email,
    });
    authStore.user = updated;
    toast.success("Profile updated!");
  } catch (e) {
    toast.error(
      (e as { message?: string }).message ?? "Failed to update profile."
    );
  } finally {
    profileLoading.value = false;
  }
}

function validatePwd() {
  pwdErrors.current = !pwd.current ? "Current password is required." : "";
  pwdErrors.newPwd =
    pwd.newPwd.length < 8 ? "New password must be at least 8 characters." : "";
  pwdErrors.confirm =
    pwd.newPwd !== pwd.confirm ? "Passwords do not match." : "";
  return !pwdErrors.current && !pwdErrors.newPwd && !pwdErrors.confirm;
}

async function changePassword() {
  if (!validatePwd()) return;
  pwdLoading.value = true;
  try {
    await authService.changePassword({
      currentPassword: pwd.current,
      newPassword: pwd.newPwd,
    });
    toast.success("Password changed successfully!");
    pwd.current = pwd.newPwd = pwd.confirm = "";
  } catch (e) {
    toast.error(
      (e as { message?: string }).message ?? "Failed to change password."
    );
  } finally {
    pwdLoading.value = false;
  }
}

async function confirmDelete() {
  deleteLoading.value = true;
  try {
    await authService.deleteAccount();
    toast.info("Your account has been deleted.");
    await logout();
  } catch (e) {
    toast.error((e as { message?: string }).message ?? "Deletion failed.");
    deleteLoading.value = false;
  }
}
</script>

<template>
  <div class="p-6 sm:p-8 max-w-2xl mx-auto space-y-6">
    <!-- Header -->
    <div>
      <h1 class="text-2xl font-black text-white">Account Settings</h1>
      <p class="text-sm text-white/40 mt-1">
        Manage your profile and account preferences.
      </p>
    </div>

    <!-- Profile section -->
    <div class="glass-card rounded-2xl p-6 space-y-5">
      <h2 class="text-base font-semibold text-white">Profile Information</h2>
      <form class="space-y-4" @submit.prevent="saveProfile">
        <BaseInput
          v-model="profile.name"
          label="Full name"
          placeholder="Jane Smith"
          :error="profileErrors.name"
          required
        />
        <BaseInput
          v-model="profile.email"
          label="Email address"
          type="email"
          placeholder="you@example.com"
          :error="profileErrors.email"
          required
        />
        <div class="flex justify-end">
          <BaseButton type="submit" variant="primary" :loading="profileLoading"
            >Save Changes</BaseButton
          >
        </div>
      </form>
    </div>

    <!-- Password section -->
    <div class="glass-card rounded-2xl p-6 space-y-5">
      <h2 class="text-base font-semibold text-white">Change Password</h2>
      <form class="space-y-4" @submit.prevent="changePassword">
        <BaseInput
          v-model="pwd.current"
          label="Current password"
          type="password"
          placeholder="••••••••"
          :error="pwdErrors.current"
          required
        />
        <BaseInput
          v-model="pwd.newPwd"
          label="New password"
          type="password"
          placeholder="Min. 8 characters"
          :error="pwdErrors.newPwd"
          required
        />
        <BaseInput
          v-model="pwd.confirm"
          label="Confirm new password"
          type="password"
          placeholder="Repeat new password"
          :error="pwdErrors.confirm"
          required
        />
        <div class="flex justify-end">
          <BaseButton type="submit" variant="primary" :loading="pwdLoading"
            >Update Password</BaseButton
          >
        </div>
      </form>
    </div>

    <!-- Danger zone -->
    <div
      class="rounded-2xl border border-red-500/20 bg-red-500/5 p-6 space-y-4"
    >
      <h2 class="text-base font-semibold text-red-400">Danger Zone</h2>
      <div class="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <p class="text-sm font-medium text-white">Delete Account</p>
          <p class="text-xs text-white/40 mt-0.5">
            Permanently delete your account and all your data. This cannot be
            undone.
          </p>
        </div>
        <BaseButton variant="danger" @click="deleteModalOpen = true"
          >Delete Account</BaseButton
        >
      </div>
    </div>

    <!-- Confirm delete modal -->
    <BaseModal v-model:open="deleteModalOpen" title="Delete Account" size="sm">
      <p class="text-sm text-white/70 leading-relaxed">
        Are you absolutely sure? This will permanently delete your account, all
        your analyses, and all associated data.
        <span class="text-red-400 font-semibold"
          >This action cannot be undone.</span
        >
      </p>
      <template #footer>
        <BaseButton variant="ghost" @click="deleteModalOpen = false"
          >Cancel</BaseButton
        >
        <BaseButton
          variant="danger"
          :loading="deleteLoading"
          @click="confirmDelete"
        >
          Yes, delete my account
        </BaseButton>
      </template>
    </BaseModal>
  </div>
</template>
