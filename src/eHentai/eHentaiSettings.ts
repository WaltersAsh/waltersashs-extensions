import {
    DUIButton,
    DUINavigationButton,
    SourceStateManager
} from '@paperback/types';

export const modifySearch = (stateManager: SourceStateManager): DUINavigationButton => {
    return App.createDUINavigationButton({
        id: 'modifySearch',
        label: 'Modify Search',
        form: App.createDUIForm({
            onSubmit: async values => {
                stateManager.store('extraSearchArgs', values.extraSearchArgs.replace(/[“”‘’]/g, '"'));
            },
            sections: async () => {
                return [App.createDUISection({
                    id: 'modifySearchSection',
                    isHidden: false,
                    footer: 'Note: searches with only exclusions do not work, including on the home page',
                    rows: async () => {
                        return [App.createDUIInputField({
                            id: 'extraSearchArgs',
                            value: App.createDUIBinding(await stateManager.retrieve('extraSearchArgs') ?? ''),
                            label: 'Extra Args:'
                        })];
                    }
                })];
            }
        })
    });
};

export const resetSettings = (stateManager: SourceStateManager): DUIButton => {
    return App.createDUIButton({
        id: 'resetSettings',
        label: 'Reset to Default',
        onTap: async () => {
            stateManager.store('extraSearchArgs', null);
        }
    });
};