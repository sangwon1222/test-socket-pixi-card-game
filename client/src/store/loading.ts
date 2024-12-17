import { reactive } from 'vue';

export const loadingStore: TypeParam = reactive({
  isLoading: false,
});

interface TypeParam {
  isLoading: boolean;
}
