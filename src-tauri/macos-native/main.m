#import <Cocoa/Cocoa.h>
#import <WebKit/WebKit.h>

@interface AppDelegate : NSObject <NSApplicationDelegate, WKNavigationDelegate, WKUIDelegate>
@property (strong, nonatomic) NSWindow *window;
@property (strong, nonatomic) WKWebView *webView;
@end

@implementation AppDelegate

- (void)applicationDidFinishLaunching:(NSNotification *)notification {
    NSRect screenFrame = [[NSScreen mainScreen] visibleFrame];
    CGFloat width = MIN(1460.0, screenFrame.size.width * 0.94);
    CGFloat height = MIN(920.0, screenFrame.size.height * 0.92);
    NSRect windowRect = NSMakeRect(
        screenFrame.origin.x + (screenFrame.size.width - width) / 2.0,
        screenFrame.origin.y + (screenFrame.size.height - height) / 2.0,
        width,
        height
    );

    NSWindowStyleMask style = NSWindowStyleMaskTitled |
                              NSWindowStyleMaskClosable |
                              NSWindowStyleMaskMiniaturizable |
                              NSWindowStyleMaskResizable;

    self.window = [[NSWindow alloc] initWithContentRect:windowRect
                                              styleMask:style
                                                backing:NSBackingStoreBuffered
                                                  defer:NO];
    [self.window setTitle:@"Chess Mastery — Academia Lúdica & Treinador Inteligente de Aberturas"];
    [self.window setMinSize:NSMakeSize(1120, 740)];
    [self.window setBackgroundColor:[NSColor colorWithSRGBRed:1.0 green:0.976 blue:0.929 alpha:1.0]];
    [self.window setAppearance:[NSAppearance appearanceNamed:NSAppearanceNameAqua]];

    WKWebViewConfiguration *config = [[WKWebViewConfiguration alloc] init];
    [config.preferences setValue:@YES forKey:@"allowFileAccessFromFileURLs"];

    self.webView = [[WKWebView alloc] initWithFrame:[[self.window contentView] bounds]
                                      configuration:config];
    [self.webView setAutoresizingMask:(NSViewWidthSizable | NSViewHeightSizable)];
    [self.webView setNavigationDelegate:self];
    [self.webView setUIDelegate:self];
    [self.webView setValue:@NO forKey:@"drawsBackground"];

    [[self.window contentView] addSubview:self.webView];

    NSString *resourcePath = [[NSBundle mainBundle] resourcePath];
    NSString *indexPath = [resourcePath stringByAppendingPathComponent:@"dist/index.html"];
    NSURL *indexURL = [NSURL fileURLWithPath:indexPath];
    NSURL *distDirURL = [NSURL fileURLWithPath:[resourcePath stringByAppendingPathComponent:@"dist"] isDirectory:YES];

    [self.webView loadFileURL:indexURL allowingReadAccessToURL:distDirURL];

    [self setupApplicationMenu];
    [self.window makeKeyAndOrderFront:nil];
    [NSApp activateIgnoringOtherApps:YES];
}

- (void)setupApplicationMenu {
    NSMenu *menubar = [[NSMenu alloc] init];
    NSMenuItem *appMenuItem = [[NSMenuItem alloc] init];
    [menubar addItem:appMenuItem];
    [NSApp setMainMenu:menubar];

    NSMenu *appMenu = [[NSMenu alloc] init];
    NSString *appName = @"Chess Mastery";
    [appMenu addItemWithTitle:[NSString stringWithFormat:@"Sobre %@", appName]
                       action:@selector(orderFrontStandardAboutPanel:)
                keyEquivalent:@""];
    [appMenu addItem:[NSMenuItem separatorItem]];
    [appMenu addItemWithTitle:[NSString stringWithFormat:@"Ocultar %@", appName]
                       action:@selector(hide:)
                keyEquivalent:@"h"];
    [appMenu addItem:[NSMenuItem separatorItem]];
    [appMenu addItemWithTitle:[NSString stringWithFormat:@"Sair do %@", appName]
                       action:@selector(terminate:)
                keyEquivalent:@"q"];
    [appMenuItem setSubmenu:appMenu];
}

- (BOOL)applicationShouldTerminateAfterLastWindowClosed:(NSApplication *)sender {
    return YES;
}

@end

int main(int argc, const char * argv[]) {
    @autoreleasepool {
        NSApplication *app = [NSApplication sharedApplication];
        [app setActivationPolicy:NSApplicationActivationPolicyRegular];
        AppDelegate *delegate = [[AppDelegate alloc] init];
        [app setDelegate:delegate];
        [app run];
    }
    return 0;
}
