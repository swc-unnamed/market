<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { getLikes, updateMessage } from './data.remote';
</script>

<p>{(await getLikes()).likes}</p>

<Button
	onclick={async () => {
		updateMessage();
	}}>Add Likes</Button
>
