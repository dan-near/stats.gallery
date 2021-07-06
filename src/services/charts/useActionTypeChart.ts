import { ActionKind, UnifiedTransactionAction } from '@/services/near/types';
import {
  ComposeOption,
  PieSeriesOption,
  TooltipComponentOption,
} from 'echarts';
import { ref, Ref, watch } from 'vue';

type Option = ComposeOption<PieSeriesOption | TooltipComponentOption>;

export function useActionTypeChart(
  actions: Ref<UnifiedTransactionAction[]>,
): Ref<Option> {
  const pieSlice = (name: string, value: number, color: string) => ({
    name,
    value,
    itemStyle: { color },
  });

  const makeData = () => {
    const groups = actions.value.reduce((acc, current) => {
      const ak = current.action_kind;
      if (!acc[ak]) {
        acc[ak] = 0;
      }
      acc[ak]++;
      return acc;
    }, {} as Record<ActionKind, number>);

    return [
      pieSlice(
        'Function Call',
        groups[ActionKind.FUNCTION_CALL],
        'rgb(251, 191, 36)',
      ),
      pieSlice('Transfer', groups[ActionKind.TRANSFER], 'rgb(31, 41, 55)'),
      pieSlice('Add Key', groups[ActionKind.ADD_KEY], 'rgb(16, 185, 129)'),
      pieSlice('Delete Key', groups[ActionKind.DELETE_KEY], 'rgb(220, 38, 38)'),
      pieSlice(
        'Create Account',
        groups[ActionKind.CREATE_ACCOUNT],
        'rgb(16, 185, 129)',
      ),
      pieSlice(
        'Delete Account',
        groups[ActionKind.DELETE_ACCOUNT],
        'rgb(220, 38, 38)',
      ),
      pieSlice(
        'Deploy Contract',
        groups[ActionKind.DEPLOY_CONTRACT],
        'rgb(29, 78, 216)',
      ),
      pieSlice('Stake', groups[ActionKind.STAKE], 'rgb(109, 40, 217)'),
    ];
  };

  const genOption: () => Option = () => ({
    tooltip: {
      trigger: 'item',
    },
    series: [
      {
        name: 'Actions',
        type: 'pie',
        radius: '50%',
        data: makeData(),
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
      },
    ],
  });

  const option = ref(genOption());

  watch(actions, () => {
    option.value = genOption();
  });

  return option;
}
