// kintone.d.ts
declare namespace kintone {
    class Promise {
        constructor(callback: (resolve: (value?: any) => void, reject: (reason?: any) => void) => void);
    }
    namespace plugin {
        namespace app {
            function setConfig(config: {[key: string]: string}, callback?: () => void): void;
            function getConfig(pluginId: string): {[key: string]: string};
        }
    }
    namespace events {
        function on(event: string | string[], handler: (event: any) => any): void;
    }
    const $PLUGIN_ID: string;

    function isMobileApp(): boolean;
    function isMobilePage(): boolean;

    namespace app {
        function getId(): number | null;
        namespace record {
            function getHeaderMenuSpaceElement(): HTMLElement | null;
        }
    }
}
