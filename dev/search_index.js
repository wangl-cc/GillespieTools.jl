var documenterSearchIndex = {"docs":
[{"location":"reference/#References","page":"References","title":"References","text":"","category":"section"},{"location":"reference/","page":"References","title":"References","text":"Reaction\n@cfunc\n@ufunc\n@reaction\ngillespie\ngillespie!","category":"page"},{"location":"reference/#EvolutionaryModelingTools.Reaction","page":"References","title":"EvolutionaryModelingTools.Reaction","text":"Reaction{C,U}\n\nContain a \"calculate\" function and an \"update\" function. The \"calculate\" function calculates the a \"rate\" of reaction with the system state, which determines the probability weight of the reaction be selected, and the \"update\" function updates the system state, when this reaction were selected randomly.\n\n\n\n\n\n","category":"type"},{"location":"reference/#EvolutionaryModelingTools.@cfunc","page":"References","title":"EvolutionaryModelingTools.@cfunc","text":"@cfunc ex\n\nDefine a \"calculation\" function with an \"adapter\" methods used to parse args from model. \"calculate\" functions take arguments from system state and calculate \"rate\"s determining the probability weight of the reaction be selected.\n\nExample\n\nFor function definition:\n\n@cfunc @inline growth_c(r, x::Vector) = r * x # function to calculate \"growth rate\"\n\nThis macro creates two methods, an \"adapter\" method\n\ngrowth_c(args::NamedTuple) = growth_c(args.r, args.x)\n\nand the origin method\n\n@inline growth_c(r, x::Vector) = r * x\n\ninfo: Info\nFor function definition with other macros, put those macros after this macro.\n\nwarning: Warning\nThe argument name t is reserved for time. Don't use those variable names for other usage\n\n\n\n\n\n","category":"macro"},{"location":"reference/#EvolutionaryModelingTools.@ufunc","page":"References","title":"EvolutionaryModelingTools.@ufunc","text":"@ufunc ex\n\nDefine a \"update\" function with an \"adapter\" methods used to parse args from model. \"update\" functions take arguments from system state and update system state.\n\nExample\n\nFor function definition:\n\n@ufunc Base.@propagate_inbounds growth_u!(ind::CartesianIndex{1}, x) = x[ind] += 1\n\nThis macro creates two methods, an \"adapter\" method\n\ngrowth_u!(ind, args::NamedTuple) = growth_u(ind, args.x)\n\nand the origin method\n\nBase.@propagate_inbounds growth_u!(ind::CartesianIndex{1}, x) = x[ind] += 1\n\ninfo: Info\nFor function definition with other macros, put those macros after this macro.\n\nwarning: Warning\nThe argument name t is reserved for time, arguments name rng is reserved for random number generator, and the argument name ind is preserved for index of \"reaction\". Don't use those variable names for other usage\n\n\n\n\n\n","category":"macro"},{"location":"reference/#EvolutionaryModelingTools.@reaction","page":"References","title":"EvolutionaryModelingTools.@reaction","text":"@reaction name ex\n\nDefine a Reaction with the given name and ex.\n\n@reaction growth begin\n    r * x # \"calculate\" expression\n    begin\n        i = ind[1]\n        x[i] += 1 # \"update\" expression\n    end\nend\n\nwill create a Reaction with a \"calculation\" function:\n\n@cfunc Base.@propagate_inbounds growth_c(r, x) = r * x\n\nand an \"update\" function:\n\n@cfunc Base.@propagate_inbounds growth_u!(ind, x) = begin\n    i = ind[1]\n    x[i] += 1\nend\n\nwhere arguments of functions were collected from given expression automatically.\n\nnote: Note\nIf there are global variables, this macro may can not collect arguments correctly Especially, for functions which accept function and types as arguments, those functions and types may also be collect as an arguments. Thus, these variables must be marked as global variables by global before use them, even functions and types. Besides, type annotation expressions like x::Vector{Int}, types Vector and Int will not be collected. Avoid to defined your reaction with a type arguments for type annotation.\n\nwarning: Warning\nThe expression follow the same name preserve rule as @cfunc and @ufunc, don't use those variable names for other usage.\n\n\n\n\n\n","category":"macro"},{"location":"reference/#EvolutionaryModelingTools.gillespie","page":"References","title":"EvolutionaryModelingTools.gillespie","text":"gillespie([hook!, rng::AbstractRNG,] c, ps::NamedTuple, rs::Tuple)\n\nSimulate the system using the Gillespie algorithm with the given parameters, and return a tuple of updated ps and terminate state. More about terminate state, see gillespie!.\n\nArguments\n\nhook!: a function with similar arguments to \"update\" functions  and recommended to created with @ufunc macro;  unlike \"update\" functions, hook will be called after each reaction  and should return a terminate state used to terminate the simulation if it is not :finnish.\nrng: a random number generator for generate random numbers;\nc: a ContinuousClock, a end time or a tuple of a begin and a end time;\nps: a NamedTuple contains state, parameters even args used by hook! of the system;\nrs: a tuple contains reactions, all parameters required by reactions must be in ps with same name.\n\n\n\n\n\n","category":"function"},{"location":"reference/#EvolutionaryModelingTools.gillespie!","page":"References","title":"EvolutionaryModelingTools.gillespie!","text":"gillespie!(hook!, rng::AbstractRNG, c::ContinuousClock, ps::NamedTuple, rs::Tuple)\n\nSimulate the system using the Gillespie algorithm with the given parameters, and return the terminate state :finnish, :zero or any other state returns by the hook!. The terminate state :finnish means that simulation reach to the end time, and :zero means the simulation break because the total \"reaction rate\" is zero, besides, hook! should return a symbol terminate state like :break. if the return value of hook! is not :finnish, the simulation will be terminated. The clock c and parameters ps will be updated during the simulation.\n\nArguments\n\nhook!: a function with similar arguments to \"update\" functions,  and it's recommended to create hook! with @ufunc macro;  unlike \"update\" functions, hook will be called after each reaction  and should return a terminate state used to terminate the simulation if it is not :finnish.\nrng: a random number generator for generate random numbers;\nc: a clock recording time, which must be the reference clock of recorded variables in ps;\nps: a NamedTuple contains state, parameters even args used by hook! of the system;\nrs: a tuple contains reactions, all parameters required by reactions must be in ps with same name.\n\n\n\n\n\n","category":"function"},{"location":"#Introduction","page":"Introduction","title":"Introduction","text":"","category":"section"},{"location":"","page":"Introduction","title":"Introduction","text":"A simple package provides an easy way to build evolutionary biology models and simulate them by Gillespie's direct method algorithm.","category":"page"},{"location":"#Why?","page":"Introduction","title":"Why?","text":"","category":"section"},{"location":"","page":"Introduction","title":"Introduction","text":"DifferentialEquations.jl is a brilliant suite solving deferential equations, including stochastic differential equations, and it is a very good choice. However, it is not suitable for solving differential equations with variable length state, which is the main reason why I created this package.","category":"page"},{"location":"","page":"Introduction","title":"Introduction","text":"For example, in a SIR model, the host population is composed of \"Susceptible\", \"Infected\" and \"Recovered\".","category":"page"},{"location":"","page":"Introduction","title":"Introduction","text":"In a normal case, there are only one type of \"host\" and one type \"virus\" in the system. Thus the state of host population can be represent as a vector u = [S, I, R], In a complex case, the host population can be composed of many types of \"host\" and infected by many types of \"virus\". In a system with n types of \"hosts\" and m types of \"viruses\", the state of host population can also be represented as a vector by concatenating the state of each component of host u = vcat(S, vec(I), vec(R)), where S is a vector of length n and I, R are matrixes of size n × m. However, in evolutionary biology, the \"mutation\" and \"extinction\" will change the types of \"hosts\" and \"viruses\", which means the n and m will change during the evolution, and the length of the state vector u will also change.","category":"page"},{"location":"#How-to-use?","page":"Introduction","title":"How to use?","text":"","category":"section"},{"location":"","page":"Introduction","title":"Introduction","text":"Similarly to DifferentialEquations.jl, you must define reactions firstly (jump in DifferentialEquations.jl), For example, the infect reaction of above SIR model is defined as:","category":"page"},{"location":"","page":"Introduction","title":"Introduction","text":"@cfunc infect_c(β, S, I) = β * S' * I # function to calculate the rate of infection\n@ufunc function infect_u!(ind, S, I) # function to update the state when infection happens\n    # ind is the index of the reaction selected with weight calculated by `infect_c`\n    S[ind[2]] -= 1 # S_j  -> S_j  - 1\n    I[ind] += 1    # I_ij -> I_ij + 1\n    return nothing\nend\ninfect = Reaction(infect_c, infect_u!)","category":"page"},{"location":"","page":"Introduction","title":"Introduction","text":"where @cfunc is a macro to help you define a function to calculate the rate of reaction, @ufunc is a macro to help you define a function to update the state when reaction happens. Unlike DifferentialEquations.jl, the \"calculate\" function returns an array of rates, which allows variable length state and contains a lot sub-reactions. Additionally, the \"update\" function accepts a special argument ind, which tells you which sub-reaction is selected and should always be the first argument. All of these is designed to work with variable length state.","category":"page"},{"location":"","page":"Introduction","title":"Introduction","text":"Besides, there is another macro @reaction helps you define a reaction more easily. The below code is equivalent to the above code:","category":"page"},{"location":"","page":"Introduction","title":"Introduction","text":"@reaction infect begin\n    β * S' * I\n    begin\n        S[ind[2]] -= 1\n        I[ind] += 1\n    end\nend","category":"page"},{"location":"","page":"Introduction","title":"Introduction","text":"Once you have defined all reactions, put them together as a tuple:","category":"page"},{"location":"","page":"Introduction","title":"Introduction","text":"reactions = (infect, ...)","category":"page"},{"location":"","page":"Introduction","title":"Introduction","text":"and define the initial state and parameters of the system as a named tuple:","category":"page"},{"location":"","page":"Introduction","title":"Introduction","text":"params = (β = 0.1, ..., S = [10], I = fill(0, 1, 1), R = fill(0, 1, 1))","category":"page"},{"location":"","page":"Introduction","title":"Introduction","text":"Then, you can use gillespie to simulate the system:","category":"page"},{"location":"","page":"Introduction","title":"Introduction","text":"max_time = 100 # the maximum time of simulation\ngillespie(max_time, reactions, params) # return a tuple of (term_state, params)","category":"page"},{"location":"","page":"Introduction","title":"Introduction","text":"where the gillespie function returns the ps after the simulation and a flag indicate whether the simulation is finished after the maximum time, or break before the maximum time.","category":"page"},{"location":"","page":"Introduction","title":"Introduction","text":"Note: Changes of the state will not be recorded by default, but you can use my another package RecordedArrays to record them, like this:","category":"page"},{"location":"","page":"Introduction","title":"Introduction","text":"using RecordedArrays\nc = DiscreteClock(max_time) # clock store information of max_time\nS = recorded(DynamicEntry, c, [10]) # create a recorded vector as S\nI = recorded(DynamicEntry, c, fill(0, 1, 1)) # create a recorded matrix as I\nR = recorded(DynamicEntry, c, fill(0, 1, 1)) # create a recorded matrix as R\nparams = (β = 0.1, ..., S = S, I = I, R = R) # add new S, I, R to params\ngillespie(c, params, reactions) # run the simulation with new params","category":"page"},{"location":"","page":"Introduction","title":"Introduction","text":"More information about RecordedArrays, see its documentation.","category":"page"},{"location":"example/#Examples","page":"Examples","title":"Examples","text":"","category":"section"},{"location":"example/#Logistic-Growth-with-noise","page":"Examples","title":"Logistic Growth with noise","text":"","category":"section"},{"location":"example/","page":"Examples","title":"Examples","text":"This is a simple example of a logistic growth model with noise, where reaction is generated by @cfunc and @ufunc.","category":"page"},{"location":"example/","page":"Examples","title":"Examples","text":"The determine differential equation of this model is:","category":"page"},{"location":"example/","page":"Examples","title":"Examples","text":"dotx = rx left(1 - fracxK right)","category":"page"},{"location":"example/","page":"Examples","title":"Examples","text":"using RecordedArrays\nusing EvolutionaryModelingTools\nusing Random\nusing Plots\n\n# parameters\nconst r = 0.5 # growth rate\nconst d = 0.1 # mortality rate\nconst K = 100 # carrying capacity\n\n# clock\nc = ContinuousClock(100.0) # define a clock, the population will growth for 100 time unit\n\n# state\nx = recorded(DynamicEntry, c, 10)  # define a scalar to record population size\n\n# reactions\n\n@cfunc growth_c(r, x) = r * x\n@ufunc growth_u!(ind, x) = x[ind] += 1\ngrowth = Reaction(growth_c, growth_u!)\n\n@cfunc death_c(d, x) = d * x\n@ufunc death_u!(ind, x) = x[ind] -= 1\ndeath = Reaction(death_c, death_u!)\n\n@cfunc comp_c(r, K, x) = r * x * x / K\n@ufunc comp_u!(ind::CartesianIndex{0}, x) = x[ind] -=1\ncomp = Reaction(comp_c, comp_u!)\n\n# build the model\nps = (; r, d, K, x) # define the parameters for the model\nrs = (growth, death, comp) # define the reactions for the model\n\n# simulate\nRandom.seed!(1)\nps_new, state = gillespie(c, ps, rs)\n\n# plot\ntimeseries(ps_new.x;\n    grid=false, frame=:box, legend=false,\n    title=\"Population Dynamics\", xlabel=\"Time\", ylabel=\"Population Size\",\n)","category":"page"},{"location":"example/#Evolutionary-competitive-dynamics","page":"Examples","title":"Evolutionary competitive dynamics","text":"","category":"section"},{"location":"example/","page":"Examples","title":"Examples","text":"A simple example model to simulate the evolution of a competition, where the reactions is defined by @reaction.","category":"page"},{"location":"example/","page":"Examples","title":"Examples","text":"Unlike the previous example, this model consists of various of species introduced by mutation. And their competition is defined by a competition coefficient matrix M, where the element M_ij is the competition force from species j to i, and the element M_ii is the competition force from species i to itself.","category":"page"},{"location":"example/","page":"Examples","title":"Examples","text":"The determine differential equation of this model is:","category":"page"},{"location":"example/","page":"Examples","title":"Examples","text":"dotx_i = rx left(1 - fracsum_j x_j M_ijK right)","category":"page"},{"location":"example/","page":"Examples","title":"Examples","text":"using RecordedArrays\nusing EvolutionaryModelingTools\nusing Random\nusing Plots\n\n\n# parameters\nconst r = 0.5 # growth rate\nconst d = 0.1 # mortality rate\nconst K = 100 # carrying capacity\nconst μ = .01 # mutation rate\n\n# clock\nc = ContinuousClock(200.0) # define a clock, the population will growth for 10 time unit\n\n# state\nx = recorded(DynamicEntry, c, [10]) # define a vector to record population size\nm = recorded(StaticEntry, c, ones(1, 1)) # define a matrix to record competition coefficient\n\n# reactions\n@reaction growth begin\n    r * (1 - μ) * x\n    x[ind] += 1\nend\n\n@reaction mutation begin\n    @. r * μ * x\n    begin\n        push!(x, 1) # add a new species\n        n = length(x)\n        resize!(m, (n, n)) # resize the competition matrix\n        # new species compete with all other species and itself\n        m[:, n] = rand(rng, n)\n        m[n, 1:n-1] = rand(rng, n-1)\n    end\nend\n\n@reaction competition begin\n    begin\n        cc = r / K # baseline competition coefficient\n        @. cc * x * m * x'\n    end\n    begin\n        i = ind[1]\n        x[i] -= 1\n        if x[i] == 0 # check extinction\n            deleteat!(x, i)\n            resize!(m, (not(i), not(i)))\n        end\n    end\nend\n\n# hook function to check if all species is extinct\n@ufunc check_extinction(x) = isempty(x) ? :extinct : :finnish\n\n# build the model\nps = (; r, d, K, μ, x, m) # define the parameters for the model\nrs = (growth, mutation, competition) # define the reactions for the model\n\n# simulate\nRandom.seed!(1)\nps_new, state = gillespie(check_extinction, c, ps, rs)\n\n# plot\ntimeseries(ps_new.x;\n    grid=false, frame=:box, legend=false,\n    title=\"Population Dynamics\", xlabel=\"Time\", ylabel=\"Population Size\",\n)","category":"page"}]
}
