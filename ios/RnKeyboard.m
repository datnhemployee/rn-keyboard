#import <React/RCTUIManager.h>
#import <React/RCTBaseTextInputView.h>
#import <objc/runtime.h>
#import "RnKeyboard.h"

#define RnKeyboardTag 0x1f1f1f

NSString *const RnKeyboardAppName = @"RnKeyboard";

@implementation RnKeyboard

+ (BOOL)requiresMainQueueSetup
{
  return YES;
}

- (dispatch_queue_t)methodQueue
{
  return dispatch_get_main_queue();
}

RCT_EXPORT_MODULE(RnKeyboard);

- (NSArray<NSString *> *)supportedEvents
{
    return @[];
}

- (RCTBridge*)getBridge
{
  RCTBridge* bridge = [self.bridge valueForKey:@"parentBridge"];
  return bridge;
}

- (RCTBaseTextInputView *)getTextInput:(nonnull NSNumber*)inputId {
  RCTBridge* bridge = [self getBridge];
  if(bridge == nil)
  {
    @throw [NSException exceptionWithName:NSGenericException reason:@"Not found brigde!" userInfo:nil];
  }

  RCTBaseTextInputView* input = (RCTBaseTextInputView *)[self.bridge.uiManager viewForReactTag:inputId];
  return input;
}

- (UIView<RCTBackedTextInputViewProtocol> *)getBackedTextInput:(nonnull NSNumber*)inputId
{
  RCTBaseTextInputView* input = [self getTextInput:inputId];
  UIView<RCTBackedTextInputViewProtocol> *backTextInput = input.backedTextInputView;
  
  if (backTextInput == nil) {
    @throw [NSException exceptionWithName:NSGenericException reason:@"Not found backed text input!" userInfo:nil];
  }
  return backTextInput;
}

- (UIView *)getRnKeyboard {
  UIView *keyboardView = [[UIInputView alloc] initWithFrame:CGRectZero inputViewStyle:UIInputViewStyleKeyboard];
  [keyboardView setTranslatesAutoresizingMaskIntoConstraints:NO];
  
  RCTBridge* bridge = [self getBridge];
  UIView *rootView = [[RCTRootView alloc] initWithBridge:bridge moduleName:RnKeyboardAppName initialProperties:nil];
  [rootView setTranslatesAutoresizingMaskIntoConstraints:NO];
  [keyboardView addSubview:rootView];
  
  [rootView.leadingAnchor constraintEqualToAnchor:keyboardView.leadingAnchor].active = YES;
  [rootView.trailingAnchor constraintEqualToAnchor:keyboardView.trailingAnchor].active = YES;
  [rootView.topAnchor constraintEqualToAnchor:keyboardView.topAnchor].active = YES;
  [rootView.bottomAnchor constraintEqualToAnchor:keyboardView.bottomAnchor].active = YES;
  [keyboardView setNeedsLayout];
  return keyboardView;
}

RCT_EXPORT_METHOD(attach:(nonnull NSNumber*)inputId
                  params:(NSDictionary *)params
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
  @try {
    UIView<RCTBackedTextInputViewProtocol> *backTextInput = [self getBackedTextInput:inputId];
    [backTextInput setInputView:[self getRnKeyboard]];
    [backTextInput reloadInputViews];
    
    resolve(@"Success");
    
  } @catch (NSException *exception) {
    reject([NSString stringWithFormat:@"RnKeyboard unable to attach input with id=%@",inputId], exception.reason, nil);
  }
}

RCT_EXPORT_METHOD(detach:(nonnull NSNumber*)inputId
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
  @try {
    UIView<RCTBackedTextInputViewProtocol> *backTextInput = [self getBackedTextInput:inputId];
    
    [backTextInput setInputView:nil];
    [backTextInput reloadInputViews];
    
    resolve(@"Success");
    
  } @catch (NSException *exception) {
    reject([NSString stringWithFormat:@"RnKeyboard unable to detach input with id=%@",inputId], exception.reason, nil);
  }
}

RCT_EXPORT_METHOD(insert:(nonnull NSNumber*)inputId
                  key:(NSString *)key
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
  @try {
    UIView<RCTBackedTextInputViewProtocol> *backTextInput = [self getBackedTextInput:inputId];
    
    [backTextInput replaceRange:[backTextInput selectedTextRange] withText:key];
    resolve(@"Success");
    
  } @catch (NSException *exception) {
    reject([NSString stringWithFormat:@"RnKeyboard unable to insert key=%@ to input=%@", key, inputId], exception.reason, nil);
  }
}

RCT_EXPORT_METHOD(backspace:(nonnull NSNumber*)inputId
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
  @try {
    UIView<RCTBackedTextInputViewProtocol> *backTextInput = [self getBackedTextInput:inputId];
    
    UITextRange* range = backTextInput.selectedTextRange;
    if ([backTextInput comparePosition:range.start toPosition:range.end] == 0) {
      range = [backTextInput textRangeFromPosition:[backTextInput positionFromPosition:range.start offset:-1] toPosition:range.start];
    }
    [backTextInput replaceRange:range withText:@""];
    resolve(@"Success");
    
  } @catch (NSException *exception) {
    reject([NSString stringWithFormat:@"RnKeyboard unable to backspace to input=%@", inputId], exception.reason, nil);
  }
}

RCT_EXPORT_METHOD(submit:(nonnull NSNumber*)inputId
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
  @try {
    RCTBaseTextInputView *textInput = [self getTextInput:inputId];
    UIView<RCTBackedTextInputViewProtocol> *backTextInput = [self getBackedTextInput:inputId];
    
    if ([textInput textInputShouldReturn]) {
      [backTextInput endEditing:YES];
    }
    resolve(@"Success");
  } @catch (NSException *exception) {
    reject([NSString stringWithFormat:@"RnKeyboard unable to submit to input=%@", inputId], exception.reason, nil);
  }
}

@end
