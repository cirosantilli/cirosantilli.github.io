; https://cirosantilli.com/llvm-ir-hello-world

; Declare the string constant as a global constant.
@.str = private unnamed_addr constant [12 x i8] c"hello world\00"

; External declaration of the puts function
declare i32 @puts(ptr nocapture) nounwind

; Definition of main function
define i32 @main() {
  ; Call puts function to write out the string to stdout.
  call i32 @puts(ptr @.str)
  ret i32 0
}

; Named metadata
!0 = !{i32 42, null, !"string"}
!foo = !{!0}
