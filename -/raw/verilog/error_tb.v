/*
TODO: does it stop simulation or not? verilog 2009:

> 20.9 Severity tasks
>
> All of the severity system tasks shall print a tool-specific message, indicating the severity of the exception
condition and specific information about the condition, which shall include the following information:
>
> - The file name and line number of the severity system task call. The file name and line number shall
be same as `__FILE__ and `__LINE__ compiler directives respectively.
> - The hierarchical name of the scope in which the severity system task call is made.
> - For simulation tools, the simulation run time at which the severity system task is called.

but:

> 20.10 Elaboration system tasks
>
> If $fatal is executed then after outputting the message the elaboration may be aborted, and in no case shall
simulation be executed. Some of the elaboration system task calls may not be executed either. The
finish_number may be used in an implementation-specific manner.
>
> If $error is executed then the message is issued and the elaboration continues. However, no simulation
shall be executed.
>
> The other two tasks, $warning and $info , only output their text message but do not affect the rest of the
elaboration and the simulation.
*/
module error_tb;
    initial begin
        $error;
        $error("my error");
        $display("after");
    end
endmodule
