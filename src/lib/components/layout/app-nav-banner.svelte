<script lang="ts">
  import { cn } from '$lib/utils/tw';
  import { useSidebar } from '../ui/sidebar';

  const sidebar = useSidebar();

  let isSidebarOpen = $derived(sidebar.open);
</script>

<div class={cn('flex items-center gap-3 transition-transform duration-300', isSidebarOpen ? 'ml-2 ' : '')}>
  <img src="/images/uim-17.png" alt="Logo" class="h-8 w-8" />
  <span class=" truncate text-center text-xl font-semibold leading-none"> Unnamed Market </span>
</div>
