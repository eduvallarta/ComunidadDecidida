<script>
import { useAuthenticate } from '/src/modules/user/web/hook/use-authenticate';

export default {
  name: 'TestComponent',
  setup() {
    const { auth, loading, result, error, authenticate } = useAuthenticate();

    return { auth, loading, result, error, authenticate };
  }
};
</script>

<template>
  <div>Test Component</div>
</template>
