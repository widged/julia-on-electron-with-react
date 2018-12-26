for l in readlines(stdin)
    # write(stderr, l);
    write(stdout, "[jl] $l\n");
    if(occursin(r"^error", l))
        write(stderr, "[ERR] $l\n");
    end
end
println("END")
