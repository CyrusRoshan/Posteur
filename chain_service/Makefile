OBUILD=ocamlbuild -use-ocamlfind
PKGS=yojson,netsys,netstring,sqlite3

all: chain_service.native

chain_service.native: db_service.ml chain_service.ml
	$(OBUILD) -pkgs $(PKGS) $@

clean:
	$(OBUILD) -clean
