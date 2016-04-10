open Db_service

module StringSet = Set.Make(String)

type markov_chain =
    El of string * float * markov_chain list
  | Empty

let build_chains words sampletext len =
  let rec find_chains word ls =
    let rec get_n n ls =
      match ls with
      | [] -> []
      | hd :: tl -> begin match n with
                   | 0 -> []
                   | _ -> hd :: get_n (n - 1) tl
                   end
    in
    begin match ls with
    | [] -> []
    | hd :: tl when hd = word ->
        get_n len ls :: find_chains word tl
    | _ :: tl ->
        find_chains word tl
    end
  in
  StringSet.elements words
  |> List.map (fun w -> find_chains w sampletext)

let collapse_chains chains =
  List.map
    (fun lsls ->

  let xs, xs' = List.partition

let () =
  let md = Db_service.retrieve_all_emails () in
  let emails = md.emails in
  let aggregates = Hashtbl.create 20 in
  let () =
    List.iter
      (fun msg ->
        try
          let already_there = Hashtbl.find aggregates msg.from in
          Hashtbl.replace aggregates msg.from (msg.body :: already_there)
        with _ -> Hashtbl.replace aggregates msg.from [msg.body])
      emails
  in
  let aggregates' = Hashtbl.create 20 in
  let () =
    Hashtbl.iter
      (fun sender messages ->
        let rex = Str.regexp_string " " in
        List.iter
          (fun msg ->
            Str.split rex msg
            |> List.map String.lowercase
            |> Hashtbl.add aggregates' sender)
          messages;
        Hashtbl.find_all aggregates' sender
        |> List.flatten
        |> Hashtbl.replace aggregates' sender)
      aggregates
  in
  let unique_words = Hashtbl.create 20 in
  let () =
    Hashtbl.iter
      (fun sender messages ->
        StringSet.of_list messages
        |> Hashtbl.add unique_words sender)
      aggregates'
  in
