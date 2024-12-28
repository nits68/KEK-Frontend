<script setup lang="ts">
import { reactive, watch } from 'vue';
import LoginHelper from '../dialogs/users/LoginHelper';
import { useI18n } from 'vue-i18n';

interface IProps {
  password: string;
}
const props = defineProps<IProps>();

const { t } = useI18n();

const emit = defineEmits<{
  (e: 'password_changed', result: boolean): void;
}>();

interface IMapData {
  isOk: boolean;
  label: string;
  test: string; // use later
}

interface IReactiveData {
  check: Map<string, IMapData>;
}

const r = reactive<IReactiveData>({
  check: new Map(),
});

function isValidPassword(pass: string): boolean {
  r.check.set('length', {
    isOk: LoginHelper.IsLengthOk(pass),
    label: `${t('length')} >= 8`,
    test: 'QCheckBoxLength', // use later
  });
  r.check.set('upper', {
    isOk: LoginHelper.IsAnyUppercaseChar(pass),
    label: t('uppercase_chars'),
    test: 'QCheckBoxUpper', // use later
  });
  r.check.set('lower', {
    isOk: LoginHelper.IsAnyLowercaseChar(pass),
    label: t('lowercase_chars'),
    test: 'QCheckBoxLower', // use later
  });
  r.check.set('special', {
    isOk: LoginHelper.IsAnySpecialChar(pass),
    label: t('special_chars'),
    test: 'QCheckBoxSpecial', // use later
  });
  r.check.set('number', {
    isOk: LoginHelper.IsAnyNumber(pass),
    label: t('numbers'),
    test: 'QCheckBoxNumber', // use later
  });
  if (pass.length == 0) return false;
  return (r.check.get('length')?.isOk &&
    r.check.get('upper')?.isOk &&
    r.check.get('lower')?.isOk &&
    r.check.get('special')?.isOk &&
    r.check.get('number')?.isOk) as boolean;
}

isValidPassword(props.password);

watch(props, () => {
  emit('password_changed', isValidPassword(props.password));
});
</script>

<template>
  <q-checkbox
    v-for="e in r.check.entries()"
    :key="e[0]"
    v-model="e[1].isOk"
    checked-icon="star"
    class="q-ma-none"
    :class="e[1].isOk ? 'text-green' : 'text-red'"
    :color="e[1].isOk ? 'green' : 'red'"
    :data-test="e[1].test"
    disable
    keep-color
    :label="e[1].label"
    unchecked-icon="star_border"
  />
</template>

<style lang="scss" scoped></style>
