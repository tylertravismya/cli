@echo off
>./samples/options/%1.options.json (
realmethods_cli stack_options --quiet true %1
)